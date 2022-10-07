import { Flex } from "@chakra-ui/react";
import Comment, { AvatarType, Interaction } from "./Comment";

type ChildCommentsProps = {
    comments: any[]
    replyInputAvatar?(comment): AvatarType | undefined
    replyButtonAvatar?(comment): AvatarType | undefined
    usernameTagged?(comment): boolean
    canEdit?(comment): boolean
    canDelete?(comment): boolean
    onInteractionSubmit?(type: Interaction, comment): void
    onReplySubmit?(e, comment, replyValue: string): void
    onEditSubmit?(e, comment, editvalue: string): void
    onDeleteSubmit?(e, comment): void
}

function ChildComments({ comments, ...props }: ChildCommentsProps) {
    return (
        <Flex
            className="mt-2"
            direction={"column"}
            gap={2}>
            {comments.map(comment => (
                <Comment
                    avatar={{ username: comment.author.username, ...comment.author.avatar }}
                    size="small"
                    key={comment.id}
                    comment={comment}
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
            ))}
        </Flex>
    );
}

export default ChildComments;