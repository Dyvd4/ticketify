import Joi from "joi";
import { User } from "@prisma/client";

export const UserSchema = Joi.object<User>({
    id: Joi.string(),
    username: Joi
        .string()
        .required(),
    password: Joi
        .string()
        .required()
        .max(100)
        .messages({
            "string.max": "Password should not be longer than 100 characters"
        })
})

export default UserSchema;