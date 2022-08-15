import Joi from "joi";
import mongoose from "mongoose";
import { DocumentWithTimeStamps } from "./base";

interface ITodo extends DocumentWithTimeStamps {
    task: string,
    color: string
}

const TodoModel = new mongoose.Schema<ITodo>({
    task: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, { timestamps: true, collection: "Todo" });

export const TodoSchema = Joi.object<ITodo>({
    task: Joi
        .string()
        .required(),
    color: Joi
        .string()
        .required()
});

const Todo = mongoose.model<ITodo>("Todo", TodoModel);
export default Todo;