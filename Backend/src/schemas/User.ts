import Joi from "joi";
import { User } from "@prisma/client";

const UserCreateSchema = Joi.object<User>({
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

export const UserUpdateSchema = Joi.object({
    id: Joi.string(),
    username: Joi
        .string()
        .required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
})

export const NewPasswordSchema = Joi.object({
    newPassword: Joi
        .string()
        .max(100)
        .messages({
            "string.max": "Password should not be longer than 100 characters"
        }),
    repeatedNewPassword: Joi
        .string()
        .max(100)
        .messages({
            "string.max": "Password should not be longer than 100 characters"
        })
});

export default UserCreateSchema;