import { useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addEntity, removeEntity, updateEntity } from "src/api/entity";
import { commentSortParamAtom } from "src/context/atoms";
import { useCurrentUser } from "src/hooks/user";
import { addComment, deleteComment, getComment, replaceComment } from "src/utils/comment";

export const useCommentMutations = (defaultReplyValue = "", defaultEditValue = "") => {

    const toast = useToast();
    const queryClient = useQueryClient();
    const [replyValue, setReplyValue] = useState(defaultReplyValue);
    const [editValue, setEditValue] = useState(defaultEditValue);
    const { currentUser } = useCurrentUser(true);
    const [sortParam] = useAtom(commentSortParamAtom);

    const cancelCommentQuery = () => queryClient.cancelQueries(["comments", sortParam]);
    const getChildComments = (parentCommentId: string) => queryClient.getQueryData(["comment/childs", parentCommentId]) as any[];
    const getComments = () => {
        // 🥵
        const comments = queryClient.getQueryData(["comments", sortParam]) as any[];
        // otherwise the childs are outdated
        return comments.map(comment => {
            comment.childs = getChildComments(comment.id);
            return comment;
        });
    }
    const setCommentChildQuery = (parentCommentId: string, childs: any[]) => {
        queryClient.setQueryData(["comment/childs", parentCommentId], childs);
    }
    const setCommentQuery = (parentComments: any[]) => {
        queryClient.setQueryData(["comments", sortParam], parentComments);
        // 🥵
        parentComments.forEach(comment => {
            if (comment.childs.length === 0) {
                queryClient.setQueryData(["comment/childs", comment.id], []);
            }
        });
    }
    const setQuery = (newChildComments: any[], newParentComments: any[]) => {
        if (newChildComments.length > 0) {
            setCommentChildQuery(newChildComments[0].parentId, newChildComments);
            // also update parent because otherwise there is
            // a discrepancy of the childs which can lead to bugs
            setCommentQuery(newParentComments);
        }
        else {
            setCommentQuery(newParentComments);
        }
    }

    const addReplyMutation = useMutation(addEntity, {
        onMutate: async ({ payload: comment }) => {
            await cancelCommentQuery();
            const currentComments = getComments();

            const ticket = queryClient.getQueryData(["ticket", String(comment.ticketId)]);
            const newComment = {
                ...comment,
                childs: [],
                authorId: currentUser.id,
                author: currentUser,
                ticket,
                likes: [],
                dislikes: [],
                hearts: [],
                liked: false,
                disliked: false,
                hearted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const { childComments, parentComments, oldChildComments, oldParentComments } = addComment(currentComments, comment.parentId, newComment);
            setQuery(childComments, parentComments);
            return { parentComments: oldParentComments, childComments: oldChildComments, addedComment: newComment };
        },
        onError: (error, variables, context) => {
            setQuery((context! as any).childComments, (context! as any).parentComments)
        },
        onSuccess: async (response, { payload: newComment }, context) => {
            const currentComments = getComments();
            const addedComment = (context! as any).addedComment;
            const { childComments, parentComments } = replaceComment(currentComments, newComment.id, {
                ...addedComment,
                id: response.data.id
            });
            setQuery(childComments, parentComments);
            await queryClient.invalidateQueries(["comments/count"]);
            setReplyValue("");
            toast({
                title: "successfully replied",
                status: "success"
            });
        },
    });
    const editCommentMutation = useMutation(updateEntity, {
        onMutate: async ({ payload: comment, entityId: commentId }) => {
            await cancelCommentQuery();
            const currentComments = getComments();
            const oldComment = getComment(currentComments, commentId);
            const { childComments, oldChildComments, parentComments, oldParentComments } = replaceComment(currentComments, commentId, {
                ...oldComment,
                ...comment
            });
            setQuery(childComments, parentComments);
            return { childComments: oldChildComments, parentComments: oldParentComments };
        },
        onError: (error, variables, context) => {
            setQuery((context! as any).childComments, (context! as any).parentComments)
        },
        onSuccess: (response) => {
            setEditValue(response.data.content);
            toast({
                title: "successfully edited comment",
                status: "success"
            });
        }
    });
    const deleteCommentMutation = useMutation(removeEntity, {
        onMutate: async ({ entityId: commentId }) => {
            await cancelCommentQuery();
            const currentComments = getComments()
            const { childComments, oldChildComments, parentComments, oldParentComments } = deleteComment(currentComments, commentId!);
            setQuery(childComments, parentComments);
            return { childComments: oldChildComments, parentComments: oldParentComments };
        },
        onError: (error, variables, context) => {
            setQuery((context! as any).childComments, (context! as any).parentComments)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["comments/count"])
            toast({
                title: "successfully removed comment",
                status: "success"
            });
        }
    });
    const addInteractionMutation = useMutation(addEntity, {
        onMutate: async ({ payload: interaction }) => {
            await cancelCommentQuery();
            interaction.createdFromId = currentUser.id;
            const currentComments = getComments();
            const oldComment = getComment(currentComments, interaction.commentId);

            const likes = [...oldComment.likes.filter(like => like.createdFromId !== currentUser.id)];
            const dislikes = [...oldComment.dislikes.filter(dislike => dislike.createdFromId !== currentUser.id)];
            const hearts = [...oldComment.hearts.filter(heart => heart.createdFromId !== currentUser.id)];

            const existingInteraction = [
                ...oldComment.likes,
                ...oldComment.dislikes,
                ...oldComment.hearts
            ].find(i => i.type === interaction.type && i.createdFromId === interaction.createdFromId)

            if (interaction.type === "like" && !existingInteraction) likes.push(interaction)
            if (interaction.type === "dislike" && !existingInteraction) dislikes.push(interaction);
            if (interaction.type === "heart" && !existingInteraction) hearts.push(interaction);

            const newComment = {
                ...oldComment,
                likes,
                dislikes,
                hearts,
                liked: !!likes.find(like => like.createdFromId === currentUser.id),
                disliked: !!dislikes.find(dislike => dislike.createdFromId === currentUser.id),
                hearted: !!hearts.find(heart => heart.createdFromId === currentUser.id)
            }

            const { childComments, oldChildComments, parentComments, oldParentComments } = replaceComment(currentComments, newComment.id, newComment);
            setQuery(childComments, parentComments)
            return { childComments: oldChildComments, parentComments: oldParentComments };
        },
        onError: (error, variables, context) => {
            setQuery((context! as any).childComments, (context! as any).parentComments)
        },
    });

    return {
        addReplyMutation,
        editCommentMutation,
        deleteCommentMutation,
        addInteractionMutation,
        replyValue,
        setReplyValue,
        editValue,
        setEditValue
    }
}