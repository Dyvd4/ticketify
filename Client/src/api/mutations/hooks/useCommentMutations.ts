import { useAtom } from "jotai";
import { useMutation, useQueryClient } from "react-query";
import { addEntity, removeEntity, updateEntity } from "src/api/entity";
import { commentSortParamAtom, hackyCommentRefreshAtom } from "src/context/atoms";
import { useCurrentUser } from "src/hooks/user";
import { addComment, deleteComment, getComment, replaceComment } from "src/utils/comment";

const useCommentMutations = (ticketId) => {
    const queryClient = useQueryClient();
    const { currentUser } = useCurrentUser({ includeAllEntities: true });
    const [sortParam] = useAtom(commentSortParamAtom);
    const { 1: setCommentRefreshAtom } = useAtom(hackyCommentRefreshAtom);

    const cancelCommentQuery = () => queryClient.cancelQueries(["comments", sortParam, ticketId]);
    const getComments = () => queryClient.getQueryData(["comments", sortParam, ticketId]) as any[];
    const setCommentQuery = (comments: any[]) =>
        queryClient.setQueryData(["comments", sortParam, ticketId], comments);

    const addCommentMutation = useMutation(addEntity, {
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
                updatedAt: new Date(),
            };

            const { comments, oldComments } = addComment(
                currentComments,
                newComment,
                comment.parentId
            );
            setCommentQuery(comments);
            return { comments: oldComments, addedComment: newComment };
        },
        onError: (error, variables, context) => {
            setCommentQuery((context! as any).comments);
        },
        onSuccess: async (response, { payload: newComment }, context) => {
            await queryClient.invalidateQueries(["comments/count"]);
            const currentComments = getComments();
            const addedComment = (context! as any).addedComment;
            const { comments } = replaceComment(currentComments, newComment.id, {
                ...addedComment,
                id: response.data.id,
            });
            setCommentQuery(comments);
        },
    });
    const editCommentMutation = useMutation(updateEntity, {
        onMutate: async ({ payload: comment, entityId: commentId }) => {
            await cancelCommentQuery();
            const currentComments = getComments();
            const oldComment = getComment(currentComments, commentId);
            const { comments, oldComments } = replaceComment(currentComments, commentId!, {
                ...oldComment,
                ...comment,
                updatedAt: new Date(),
            });
            setCommentQuery(comments);
            setCommentRefreshAtom((hackyNumber) => hackyNumber + 1);
            return { comments: oldComments };
        },
        onError: (error, variables, context) => {
            setCommentQuery((context! as any).comments);
        },
    });
    const deleteCommentMutation = useMutation(removeEntity, {
        onMutate: async ({ entityId: commentId }) => {
            await cancelCommentQuery();
            const currentComments = getComments();
            const { comments, oldComments } = deleteComment(currentComments, commentId!);
            setCommentQuery(comments);
            return { comments: oldComments };
        },
        onError: (error, variables, context) => {
            setCommentQuery((context! as any).comments);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["comments/count"]);
        },
    });
    const addInteractionMutation = useMutation(addEntity, {
        onMutate: async ({ payload: interaction }) => {
            await cancelCommentQuery();
            interaction.createdFromId = currentUser.id;
            const currentComments = getComments();
            const oldComment = getComment(currentComments, interaction.commentId);

            const likes = [
                ...oldComment.likes.filter((like) => like.createdFromId !== currentUser.id),
            ];
            const dislikes = [
                ...oldComment.dislikes.filter(
                    (dislike) => dislike.createdFromId !== currentUser.id
                ),
            ];
            const hearts = [
                ...oldComment.hearts.filter((heart) => heart.createdFromId !== currentUser.id),
            ];

            const existingInteraction = [
                ...oldComment.likes,
                ...oldComment.dislikes,
                ...oldComment.hearts,
            ].find(
                (i) => i.type === interaction.type && i.createdFromId === interaction.createdFromId
            );

            if (interaction.type === "like" && !existingInteraction) likes.push(interaction);
            if (interaction.type === "dislike" && !existingInteraction) dislikes.push(interaction);
            if (interaction.type === "heart" && !existingInteraction) hearts.push(interaction);

            const newComment = {
                ...oldComment,
                likes,
                dislikes,
                hearts,
                liked: !!likes.find((like) => like.createdFromId === currentUser.id),
                disliked: !!dislikes.find((dislike) => dislike.createdFromId === currentUser.id),
                hearted: !!hearts.find((heart) => heart.createdFromId === currentUser.id),
            };

            const { comments, oldComments } = replaceComment(
                currentComments,
                newComment.id,
                newComment
            );
            setCommentQuery(comments);
            setCommentRefreshAtom((hackyNumber) => hackyNumber + 1);
            return { comments: oldComments };
        },
        onError: (error, variables, context) => {
            setCommentQuery((context! as any).comments);
        },
    });

    return {
        addCommentMutation,
        editCommentMutation,
        deleteCommentMutation,
        addInteractionMutation,
    };
};

export default useCommentMutations;
