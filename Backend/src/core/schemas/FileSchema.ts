import Joi from "joi";
import { File } from "@prisma/client";

export const FileSchema = Joi.object<File>({
    id: Joi.string(),
    fileName: Joi
        .string()
        .required(),
    originalFileName: Joi
        .string()
        .required(),
    mimeType: Joi
        .string()
        .required()
}).options({
    abortEarly: false
});

export default FileSchema;