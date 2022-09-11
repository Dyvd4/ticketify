import { Comment } from "@prisma/client";

const map = (comment: Comment) => {
    const { content, ticketId, authorId, parentId } = comment;
    return {
        content,
        ticketId,
        authorId,
        parentId
    }
}
export default map