import { Avatar, Box, Flex, Link, Tag, useDisclosure } from "@chakra-ui/react";
import isAfter from "date-fns/isAfter";
import { useAtom } from "jotai";
import { ComponentPropsWithRef, useRef, useState } from "react";
import HeartButton from "src/components/Buttons/Heart";
import { hackyCommentRefreshAtom } from "src/context/atoms";
import useHasOverflow from "src/hooks/useHasOverflow";
import { getDurationAgo } from "src/utils/date";
import { getDataUrl } from "src/utils/image";
import ShowMore from "../ShowMore";
import ActionMenu from "./ActionMenu";
import ChildComments from "./ChildComments";
import DeleteDialog from "./DeleteDialog";
import Input from "./Input";
import LikeButton, { LikeButtonVariant } from "./LikeButton";
import RepliesButton from "./RepliesButton";

export type CommentSize = "normal" | "small"
export type Interaction = LikeButtonVariant | "heart"
export type AvatarType = {
    username: string
    content: string
    mimeType: string
}

const defaultNoOfContentLines = 4;

type CommentProps = {
    comment: {
        authorId: string
        ticketId: number
        author: {
            username: string
            id: string
        },
        content: string
        createdAt: Date
        updatedAt: Date
        likes: any[]
        dislikes: any[]
        hearts: any[]
        liked: boolean
        disliked: boolean
        hearted: boolean
        childs: any[]
    }
    avatar?: AvatarType
    size?: CommentSize
    replyInputAvatar?(comment): AvatarType | undefined
    replyButtonAvatar?(comment): AvatarType | undefined
    usernameTagged?(comment): boolean
    canEdit?(comment): boolean
    canDelete?(comment): boolean
    onInteractionSubmit?(type: Interaction, comment): void
    onReplySubmit?(e, comment, replyValue: string): void
    onEditSubmit?(e, comment, editvalue: string): void
    onDeleteSubmit?(e, comment): void
} & ComponentPropsWithRef<"div">

function Comment(props: CommentProps) {
    // props
    // -----
    const {
        comment,
        size = "normal",
        avatar,
        replyInputAvatar,
        replyButtonAvatar,
        usernameTagged: usernameTaggedEvaluator,
        canEdit: canEditEvaluator,
        canDelete: canDeleteEvaluator,
        onInteractionSubmit,
        onReplySubmit,
        onEditSubmit,
        onDeleteSubmit,
        ...restProps
    } = props;

    const {
        author,
        content,
        createdAt,
        updatedAt,
        likes,
        dislikes,
        hearts,
    } = comment;

    // state
    // -----
    const [activeState, setActiveState] = useState({
        reply: false,
        hover: false,
        edit: false,
        childs: false
    });

    const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);
    const { isOpen: deleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const contentHasOverflow = useHasOverflow(contentRef);
    const [replyValue, setReplyValue] = useState("");
    const [editValue, setEditValue] = useState(comment.content);

    useAtom(hackyCommentRefreshAtom);

    // event handler
    // -------------
    const handleInteractionOnSubmit = (type: Interaction) => {
        setActiveState({
            ...activeState,
            [type]: !activeState[type]
        });
        if (props.onInteractionSubmit) props.onInteractionSubmit(type, comment);
    }

    const handleReplyOnCancel = () => {
        setActiveState({ ...activeState, reply: false });
        setReplyValue("");
    }

    const handleReplyOnSubmit = (e) => {
        setActiveState({ ...activeState, reply: false });
        setReplyValue("");
        if (props.onReplySubmit) props.onReplySubmit(e, comment, replyValue);
    }

    const handleEditOnCancel = () => {
        setActiveState({ ...activeState, edit: false });
        setEditValue(comment.content);
    }

    const handleEditOnSubmit = (e) => {
        setActiveState({ ...activeState, edit: false });
        if (props.onEditSubmit) props.onEditSubmit(e, comment, editValue);
    }

    const handleDeleteOnSubmit = (e) => {
        if (props.onDeleteSubmit) props.onDeleteSubmit(e, comment);
        onDeleteDialogClose();
    }

    const canEdit = canEditEvaluator && canEditEvaluator(comment)
    const canDelete = canDeleteEvaluator && canDeleteEvaluator(comment);
    const usernameTagged = usernameTaggedEvaluator && usernameTaggedEvaluator(comment);
    const showMore = noOfContentLines === defaultNoOfContentLines;

    return (
        <Flex
            data-testid="Comment"
            className="comment"
            gap={3}
            {...restProps}>
            {avatar && <>
                <Link href={`/User/${author.id}`}>
                    <Avatar
                        size={size === "small" ? "sm" : "md"}
                        name={author.username}
                        src={getDataUrl(avatar.content, avatar.mimeType)}
                    />
                </Link>
            </>}
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
                            {usernameTagged && <>
                                <Tag className="rounded-full">
                                    <div className="text-base font-bold">
                                        {author.username}
                                    </div>
                                </Tag>
                            </>}
                            {!usernameTagged && <>
                                <div className="text-base font-bold">
                                    {author.username}
                                </div>
                            </>}
                            <div className="text-sm cursor-pointer text-secondary flex items-center gap-1">
                                <span>
                                    {getDurationAgo(new Date(createdAt))}
                                </span>
                                {isAfter(new Date(updatedAt), new Date(createdAt)) && <>
                                    <span>
                                        (edited)
                                    </span>
                                </>}
                            </div>
                        </Flex>
                    </Flex>
                    {!activeState.edit && <>
                        <Box
                            ref={contentRef}
                            noOfLines={noOfContentLines}
                            className={`text-sm ${usernameTagged ? "pl-1 pt-1" : ""}`}>
                            {content}
                        </Box>
                        {contentHasOverflow && <>
                            <ShowMore
                                onClick={() => setNoOfContentLines(showMore ? 100000000000 : defaultNoOfContentLines)}
                                showMore={showMore}
                            />
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
                                data-testid="CommentReplyButton"
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
                        avatar={props.replyInputAvatar && props.replyInputAvatar(comment)}
                        variant="reply"
                        className="mt-2"
                        value={replyValue}
                        setValue={setReplyValue}
                        onCancel={handleReplyOnCancel}
                        onSubmit={handleReplyOnSubmit}
                    />
                </>}
                {comment.childs.length > 0 && !activeState.edit && <>
                    <Box>
                        <RepliesButton
                            avatar={props.replyButtonAvatar && props.replyButtonAvatar(comment)}
                            active={activeState.childs}
                            setActive={active => setActiveState({ ...activeState, childs: active })}
                            repliesCount={comment.childs.length}
                            className="mt-2"
                        />
                        {activeState.childs && <>
                            <ChildComments
                                comments={comment.childs}
                                onInteractionSubmit={props.onInteractionSubmit}
                                onReplySubmit={props.onReplySubmit}
                                onEditSubmit={props.onEditSubmit}
                                onDeleteSubmit={props.onDeleteSubmit}
                                replyInputAvatar={props.replyInputAvatar}
                                replyButtonAvatar={props.replyButtonAvatar}
                                usernameTagged={props.usernameTagged}
                                canEdit={props.canEdit}
                                canDelete={props.canDelete}
                            />
                        </>}
                    </Box>
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