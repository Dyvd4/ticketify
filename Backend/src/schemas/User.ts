import Joi from "joi";
import mongoose from "mongoose";
import { DocumentWithTimeStamps } from "./base";

interface IUser extends DocumentWithTimeStamps {
    username: string,
    password: string
}

const UserModel = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true, collection: "User" });

export const UserSchema = Joi.object<IUser>({
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
});

const User = mongoose.model<IUser>("User", UserModel);
export default User;