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
        }),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
}).options({
    abortEarly: false
});

export default UserSchema;