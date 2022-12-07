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
        .required()
}).options({
    abortEarly: false
});

export default CommentInteractionSchema;