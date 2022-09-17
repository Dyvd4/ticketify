import { Alert, AlertIcon, Button, Flex, Select, Text, useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addEntity, fetchEntity } from "src/api/entity";
import { commentSortParamAtom } from "src/context/atoms";
import { useCurrentUser } from "src/hooks/user";
import Comment from "../../../../components/Comment/Comment";
import CommentSkeleton from "src/components/Comment/CommentSkeleton";
import Input from "src/components/Comment/Input";
import { useCommentMutations } from "../hooks/comment";
import { v4 as uuid } from "uuid";

const newestCommentSortParam = {
    label: "Newest first",
    property: "newestFirst",
}
export const mostLikedCommentSortParam = {
    label: "Most likes",
    property: "mostLikes",
}
const mostHeartedCommentSortParam = {
    label: "Most hearts",
    property: "mostHearts",
}

const sortParamsData = [
    newestCommentSortParam,
    mostLikedCommentSortParam,
    mostHeartedCommentSortParam
]

type CommentsSectionProps = {
    ticket: any
}

function CommentsSection(props: CommentsSectionProps) {
    const { ticket } = props;

    const [commentInputValue, setCommentInputValue] = useState("");
    const { currentUser } = useCurrentUser(true);
    const queryClient = useQueryClient();
    const toast = useToast();

    const [sortParam, setSortParam] = useAtom(commentSortParamAtom);

    // queries
    // -------
    const { isLoading, isError, data } = useQuery(["comments", sortParam], () => {
        return fetchEntity({ route: `comments/?orderBy=${JSON.stringify(sortParam)}` });
    }, {
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false
    });

    const { isError: countError, data: count } = useQuery(["comments/count"], () => {
        return fetchEntity({ route: `comments/count` });
    }, {
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false
    });

    // mutations
    // ---------
    const addCommentMutation = useMutation(addEntity, {
        onSuccess: () => {
            setCommentInputValue("");
            toast({
                title: "successfully added comment",
                status: "success"
            });
            queryClient.invalidateQueries(["comments"])
            queryClient.invalidateQueries(["comments/count"])
        }
    });
    const {
        addInteractionMutation,
        addReplyMutation,
        editCommentMutation,
        deleteCommentMutation
    } = useCommentMutations();

    // event handler
    // -------------
    const handleOrderBySelectChange = async (e) => {
        const selectedValue = e.target.value;
        const selectedSortParam: any = sortParamsData.find(param => param.property === selectedValue) || {}
        setSortParam(selectedSortParam)
    }

    const handleInteractionSubmit = (type, comment) => {
        addInteractionMutation.mutate({
            route: "commentInteraction",
            payload: {
                type,
                commentId: comment.id
            }
        });
    }
    const handleReplySubmit = (e, comment, replyValue) => {
        addReplyMutation.mutate({
            route: "comment",
            payload: {
                id: uuid(),
                parentId: comment.parentId || comment.id,
                ticketId: ticket.id,
                content: replyValue
            }
        });
    }
    const handleEditSubmit = (e, comment, editValue) => {
        const { authorId, ticketId } = comment;
        editCommentMutation.mutate({
            route: "comment",
            entityId: comment.id,
            payload: {
                ticketId,
                authorId,
                content: editValue
            }
        });
    }
    const handleDeleteSubmit = (e, comment) => {
        deleteCommentMutation.mutate({
            route: "comment",
            entityId: comment.id
        });
    }
    const replyInputAvatarEvaluator = evalComment => {
        const avatar = currentUser
            ? {
                username: currentUser.username,
                ...ticket.responsibleUser.avatar
            }
            : null;
        return avatar;
    }
    const replyButtonAvatarEvaluator = evalComment => {
        const responsibleUserHasReplied = evalComment.childs.some(childComment => childComment.authorId === ticket.responsibleUserId);
        const avatar = responsibleUserHasReplied
            ? {
                username: ticket.responsibleUser.username,
                ...ticket.responsibleUser.avatar
            }
            : null;
        return avatar;
    }

    if (isError || countError) {
        return (
            <Alert className="rounded-md" status="error" variant="top-accent">
                <AlertIcon />
                <Text>
                    There was an error processing your request
                </Text>
            </Alert>
        )
    }

    const newestComment = !isLoading
        ? data
            .filter(comment => comment.authorId === currentUser.id)
            .sort((a, b) => {
                // @ts-ignore
                return new Date(b.createdAt) - new Date(a.createdAt);
            })[0]
        : null;
    const comments = !isLoading
        ? data.filter(comment => comment.id !== newestComment?.id)
        : [];

    return (<>
        <Flex gap={2} className="my-4 items-center">
            <Button as="h1">
                comments ({count || 0})
            </Button>
            <Select
                onChange={handleOrderBySelectChange}
                placeholder="Sort by"
                value={sortParam.property}>
                {sortParamsData.map(({ label, property, ...sortParam }) => (
                    <option
                        key={property}
                        value={property}>
                        {label}
                    </option>
                ))}
            </Select>
        </Flex>
        <Flex className="flex-col gap-6">
            <Input
                variant="add"
                value={commentInputValue}
                setValue={setCommentInputValue}
                onCancel={() => setCommentInputValue("")}
                onSubmit={() => addCommentMutation.mutate({
                    route: "comment",
                    payload: {
                        ticketId: ticket.id,
                        content: commentInputValue
                    }
                })}
            />

            <Flex className="flex-col gap-4">
                {isLoading && Array(5).fill("").map((item, index) => <CommentSkeleton key={index} />)}
                {newestComment && <>
                    <Comment
                        comment={newestComment}
                        avatar={{ username: newestComment.author.username, ...newestComment.author.avatar }}
                        key={newestComment.id}
                        onInteractionSubmit={handleInteractionSubmit}
                        onReplySubmit={handleReplySubmit}
                        onEditSubmit={handleEditSubmit}
                        onDeleteSubmit={handleDeleteSubmit}
                        replyInputAvatarEvaluator={replyInputAvatarEvaluator}
                        replyButtonAvatarEvaluator={replyButtonAvatarEvaluator}
                        usernameTaggedEvaluator={evalComment => ticket.responsibleUserId === evalComment.authorId}
                        canEditEvaluator={evalComment => currentUser.id === evalComment.authorId}
                        canDeleteEvaluator={evalComment => currentUser.id === evalComment.authorId && evalComment.childs.length === 0}
                    />
                </>}
                {comments.map(comment => (
                    <Comment
                        comment={comment}
                        avatar={{ username: comment.author.username, ...comment.author.avatar }}
                        key={comment.id}
                        onInteractionSubmit={handleInteractionSubmit}
                        onReplySubmit={handleReplySubmit}
                        onEditSubmit={handleEditSubmit}
                        onDeleteSubmit={handleDeleteSubmit}
                        replyInputAvatarEvaluator={replyInputAvatarEvaluator}
                        replyButtonAvatarEvaluator={replyButtonAvatarEvaluator}
                        usernameTaggedEvaluator={evalComment => ticket.responsibleUserId === evalComment.authorId}
                        canEditEvaluator={evalComment => currentUser.id === evalComment.authorId}
                        canDeleteEvaluator={evalComment => currentUser.id === evalComment.authorId && evalComment.childs.length === 0}
                    />
                ))}
            </Flex>
        </Flex>
        <br />
    </>
    );
}

export default CommentsSection;
