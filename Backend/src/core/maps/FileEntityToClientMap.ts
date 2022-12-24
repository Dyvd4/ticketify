import config from "@config";
import { File } from "@prisma/client";

const { FILE_UPLOAD_ROUTE_NAME } = config;

export default function FileEntityToClientMap(file: File) {
    return {
        ...file,
        contentRoute: `${FILE_UPLOAD_ROUTE_NAME}/${file.fileName}`
    }
}