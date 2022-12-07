import Joi from "joi";
import { File } from "@prisma/client";

export const FileSchema = Joi.object<File>({
    id: Joi.string(),
    fileName: Joi.string(),
    originalFileName: Joi.string(),
    mimeType: Joi.string().required(),
    content: Joi.binary().required()
}).options({
    abortEarly: false
});

export default FileSchema;