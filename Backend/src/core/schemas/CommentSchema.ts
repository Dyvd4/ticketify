import Joi from "joi";
import { Comment } from "@prisma/client";

export const CommentSchema = Joi.object<Comment>({
    id: Joi.string(),
    ticketId: Joi
        .number()
        .required(),
    content: Joi
        .string()
        .required()
        .max(1000),
    authorId: Joi
        .string()
        .required(),
    parentId: Joi
        .string()
}).options({
    abortEarly: false
});

export default CommentSchema;