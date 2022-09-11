import { Avatar, Box, Flex, Tag, useDisclosure } from "@chakra-ui/react";
import { ComponentPropsWithRef, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import HeartButton from "src/components/Buttons/Heart";
import { useCurrentUser } from "src/hooks/user";
import { useCommentMutations } from "src/pages/Ticket/Details/components/Comment/Private/hooks/comment";
import { getDurationAgo } from "src/utils/date";
import { getDataUrl } from "src/utils/image";
import { v4 as uuid } from "uuid";
import Input from "./Input";
import ActionMenu from "./Private/ActionMenu";
import DeleteDialog from "./Private/DeleteDialog";
import LikeButton, { LikeButtonVariant } from "./Private/LikeButton";
import RepliesButton from "./Private/RepliesButton";

export type CommentSize = "normal" | "small"
export type Interaction = LikeButtonVariant | "heart"

const defaultNoOfContentLines = 4;

type CommentProps = {
    ticket: any
    comment: any
    size?: CommentSize
    forceUpdate?(): void
} & ComponentPropsWithRef<"div">

function Comment(props: CommentProps) {
    // props
    // -----
    const {
        ticket,
        comment,
        forceUpdate,
        size = "normal",
        ...restProps
    } = props;

    const {
        author,
        content,
        createdAt,
        likes,
        dislikes,
        hearts
    } = comment;

    // 🥵
    const { data: childs = [] } = useQuery(["comment/childs", comment.id], () => comment.childs, {
        refetchOnWindowFocus: false,
        cacheTime: Infinity,
        staleTime: Infinity
    });

    // state
    // -----
    const [activeState, setActiveState] = useState({
        reply: false,
        hover: false,
        edit: false
    });
    const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);
    const { currentUser } = useCurrentUser(true);
    const { isOpen: deleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
    const [contentHasOverflow, setContentHasOverflow] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setContentHasOverflow(contentRef.current!.clientHeight < contentRef.current!.scrollHeight);
    }, [])

    // mutations
    // ---------
    const {
        addReplyMutation,
        editCommentMutation,
        deleteCommentMutation,
        addInteractionMutation,
        replyValue,
        setReplyValue,
        editValue,
        setEditValue
    } = useCommentMutations("", comment.content);

    // event handler
    // -------------
    const handleInteractionOnSubmit = (type: Interaction) => {
        setActiveState({
            ...activeState,
            [type]: !activeState[type]
        });
        addInteractionMutation.mutate({
            route: "commentInteraction",
            payload: {
                type,
                commentId: comment.id
            }
        });
    }

    const handleReplyOnCancel = () => {
        setActiveState({ ...activeState, reply: false });
        setReplyValue("");
    }

    const handleReplyOnSubmit = () => {
        setActiveState({ ...activeState, reply: false });
        addReplyMutation.mutate({
            route: "comment",
            payload: {
                id: uuid(),
                parentId: comment.parentId || comment.id,
                ticketId: ticket.id,
                content: replyValue
            }
        });
        if (forceUpdate) forceUpdate();
        setReplyValue("");
    }

    const handleEditOnCancel = () => {
        setActiveState({ ...activeState, edit: false });
        setEditValue(comment.content);
    }

    const handleEditOnSubmit = () => {
        setActiveState({ ...activeState, edit: false });
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

    const handleDeleteOnSubmit = () => {
        deleteCommentMutation.mutate({
            route: "comment",
            entityId: comment.id
        });
        onDeleteDialogClose();
    }

    const ownsComment = currentUser.id === comment.authorId;
    const canEdit = ownsComment;
    const canDelete = ownsComment && comment.childs.length === 0;
    const isResponsibleUser = ticket.responsibleUserId === comment.authorId;
    const showMore = noOfContentLines === defaultNoOfContentLines;

    return (
        <Flex
            className="comment"
            gap={3}
            {...restProps}>
            <Avatar
                size={size === "small" ? "sm" : "md"}
                name={author.username}
                src={getDataUrl(author.avatar.content, author.avatar.mimeType)}
            />
            <Flex flexDirection={"column"} className="w-full">
                <Flex
                    position={"relative"}
                    flexDirection={"column"}
                    onMouseOver={() => setActiveState({ ...activeState, hover: true })}
                    onMouseOut={() => setActiveState({ ...activeState, hover: false })}>
                    <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}>
                        <Flex gap={2} alignItems={"center"}>
                            {isResponsibleUser && <>
                                <Tag className="rounded-full">
                                    <div className="text-base font-bold">
                                        {author.username}
                                    </div>
                                </Tag>
                            </>}
                            {!isResponsibleUser && <>
                                <div className="text-base font-bold">
                                    {author.username}
                                </div>
                            </>}
                            <div className="text-sm cursor-pointer text-secondary">
                                {getDurationAgo(new Date(createdAt))}
                            </div>
                        </Flex>
                    </Flex>
                    {!activeState.edit && <>
                        <Box
                            ref={contentRef}
                            noOfLines={noOfContentLines}
                            className={`text-sm ${isResponsibleUser ? "pl-1 pt-1" : ""}`}>
                            {content}
                        </Box>
                        {contentHasOverflow && <>
                            <Box
                                className="pl-1 my-1 text-secondary hover:underline cursor-pointer text-sm"
                                onClick={() => setNoOfContentLines(showMore ? 100000000000 : defaultNoOfContentLines)}>
                                {showMore
                                    ? "Read more"
                                    : "Show less"}
                            </Box>
                        </>}
                        <Flex
                            alignItems={"center"}
                            mt={2}
                            gap={3}>
                            <Flex alignItems={"center"} gap={2}>
                                <LikeButton
                                    active={comment.liked}
                                    onClick={() => handleInteractionOnSubmit("like")}
                                    variant="like"
                                />
                                {likes.length}
                            </Flex>
                            <Flex alignItems={"center"} gap={2}>
                                <LikeButton
                                    active={comment.disliked}
                                    onClick={() => handleInteractionOnSubmit("dislike")}
                                    variant="dislike"
                                />
                                {dislikes.length}
                            </Flex>
                            <Flex alignItems={"center"} gap={2}>
                                <HeartButton
                                    active={comment.hearted}
                                    onClick={() => handleInteractionOnSubmit("heart")}
                                />
                                {hearts.length}
                            </Flex>
                            <Box
                                onClick={() => setActiveState({ ...activeState, reply: true })}
                                className="uppercase ml-2 select-none text-sm
                                    cursor-pointer text-secondary">
                                reply
                            </Box>
                        </Flex>
                    </>}
                    <ActionMenu
                        active={activeState.hover}
                        onDelete={canDelete ? onDeleteDialogOpen : undefined}
                        onEdit={canEdit ? () => setActiveState({ ...activeState, edit: true }) : undefined}
                    />
                </Flex>
                {activeState.reply && !activeState.edit && <>
                    <Input
                        variant="reply"
                        className="mt-2"
                        value={replyValue}
                        setValue={setReplyValue}
                        onCancel={handleReplyOnCancel}
                        onSubmit={handleReplyOnSubmit}
                    />
                </>}
                {childs.length > 0 && !activeState.edit && <>
                    <RepliesButton
                        className="mt-2"
                        ticket={ticket}
                        comments={childs}
                    />
                </>}
                {activeState.edit && <>
                    <Input
                        variant="edit"
                        className="mt-2"
                        value={editValue}
                        setValue={setEditValue}
                        onCancel={handleEditOnCancel}
                        onSubmit={handleEditOnSubmit}
                    />
                </>}
                <DeleteDialog
                    isOpen={deleteDialogOpen}
                    onClose={onDeleteDialogClose}
                    onDelete={handleDeleteOnSubmit}
                />
            </Flex>
        </Flex>
    );
}

export default Comment;