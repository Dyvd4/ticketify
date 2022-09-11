import Joi from "joi";
import { CommentInteraction } from "@prisma/client";

export const CommentInteractionSchema = Joi.object<CommentInteraction>({
    id: Joi.string(),
    type: Joi
        .string()
        .required(),
    createdFromId: Joi
        .string()
        .required(),
    commentId: Joi
        .string()
        .required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
}).options({
    abortEarly: false
});

export default CommentInteractionSchema;