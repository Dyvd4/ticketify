import Joi from "joi";
import { Comment } from "@prisma/client";

export const CommentSchema = Joi.object<Comment>({
    id: Joi.string(),
    content: Joi.string().required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
}).options({
    abortEarly: false
});

export default CommentSchema;