import { Flex } from "@chakra-ui/react";
import Comment, { AvatarType, Interaction } from "../Comment";

type ChildCommentsProps = {
    comments: any[]
    replyInputAvatarEvaluator?(comment): AvatarType | undefined
    replyButtonAvatarEvaluator?(comment): AvatarType | undefined
    usernameTaggedEvaluator?(comment): boolean
    canEditEvaluator?(comment): boolean
    canDeleteEvaluator?(comment): boolean
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
                    replyInputAvatarEvaluator={props.replyInputAvatarEvaluator}
                    replyButtonAvatarEvaluator={props.replyButtonAvatarEvaluator}
                    usernameTaggedEvaluator={props.usernameTaggedEvaluator}
                    canEditEvaluator={props.canEditEvaluator}
                    canDeleteEvaluator={props.canDeleteEvaluator}
                />
            ))}
        </Flex>
    );
}

export default ChildComments;