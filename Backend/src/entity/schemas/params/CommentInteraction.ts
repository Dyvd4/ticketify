import { CommentInteraction } from "@prisma/client";

const map = (commentInteraction: CommentInteraction) => {
    const { commentId, createdFromId, type } = commentInteraction;
    return {
        commentId,
        createdFromId,
        type
    }
}
export default map