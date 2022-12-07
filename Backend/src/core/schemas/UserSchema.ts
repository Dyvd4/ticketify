import { User } from "@prisma/client";
import Joi from "joi";

export const username = Joi
    .string()
    .required()
    .max(40);

export const email = Joi
    .string()
    .required()
    .max(100)
    .email()

export const password = Joi
    .string()
    .required()
    .max(100)
    .messages({
        "string.max": "Password should not be longer than 100 characters"
    });

const UserCreateSchema = Joi.object<User>({
    username,
    email,
    password,
}).options({
    abortEarly: false
});

export const UserSignInSchema = Joi.object({
    id: Joi.string(),
    username,
    password
});

export const NewPasswordSchema = Joi.object({
    currentPassword: password,
    newPassword: password,
    repeatedNewPassword: password
});

export default UserCreateSchema;