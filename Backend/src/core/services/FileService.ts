import config from "@config";
import { File } from "@prisma/client";

const { FILE_UPLOAD_PATH } = config;

/** @returns filePath */
export const getFilePath = (file: File) => {
    const filePath = `${FILE_UPLOAD_PATH}/${file.fileName}`
    return filePath;
}

export default {
    getFilePath
}