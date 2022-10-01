import { Alert, AlertIcon, Box, Divider, Flex, Heading, Menu, MenuItemOption, MenuList, MenuOptionGroup, Text, useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addEntity, fetchEntity } from "src/api/entity";
import useCommentMutations from "src/api/mutations/hooks/useCommentMutations";
import CommentSkeleton from "src/components/Comment/CommentSkeleton";
import Input from "src/components/Comment/Input";
import MenuButton from "src/components/Wrapper/MenuButton";
import { commentSortParamAtom } from "src/context/atoms";
import { useCurrentUser } from "src/hooks/user";
import { v4 as uuid } from "uuid";
import Comment from "../../../../components/Comment/Comment";

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
    mostLikedCommentSortParam,
    newestCommentSortParam,
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
    const {
        isLoading,
        isError,
        data: comments = []
    } = useQuery(["comments", sortParam], () => {
        return fetchEntity({ route: `comments/?orderBy=${JSON.stringify(sortParam)}` });
    }, {
        refetchOnWindowFocus: false
    });

    const { isError: countError, data: count } = useQuery(["comments/count"], () => {
        return fetchEntity({ route: `comments/count` });
    }, {
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
    const handleMenuButtonClick = async (selectedProperty) => {
        const selectedSortParam: any = sortParamsData.find(param => param.property === selectedProperty) || {}
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

    const newestComment = comments
        .filter(comment => comment.authorId === currentUser.id)
        .sort((a, b) => {
            // @ts-ignore
            return new Date(b.createdAt) - new Date(a.createdAt);
        })[0];

    return (
        <Box>
            <Flex gap={2} className="mt-4 mb-2 items-center justify-between">
                <Heading className="text-2xl p-2 whitespace-nowrap">
                    Comments ({count || 0})
                </Heading>
                <Menu>
                    <MenuButton>
                        Sort by
                    </MenuButton>
                    <MenuList>
                        <MenuOptionGroup defaultValue={sortParam.property} type="radio">
                            {sortParamsData.map(({ label, property, ...sortParam }) => (
                                <MenuItemOption
                                    onClick={() => handleMenuButtonClick(property)}
                                    key={property}
                                    value={property}>
                                    {label}
                                </MenuItemOption>
                            ))}
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
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
                    {(countError || isError) && <>
                        <Alert className="rounded-md" status="error" variant="top-accent">
                            <AlertIcon />
                            <Text>
                                There was an error processing your request
                            </Text>
                        </Alert>
                    </>}
                    {(isLoading) && Array(5).fill("").map((item, index) => <CommentSkeleton key={index} />)}
                    {newestComment && <>
                        <Text>Your newest added comment:</Text>
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
                        <Divider />
                    </>}
                    {comments.filter(comment => comment.id !== newestComment?.id)
                        .map(comment => (
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
        </Box>
    );
}

export default CommentsSection;
