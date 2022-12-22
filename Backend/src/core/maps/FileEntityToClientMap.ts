import config from "@config";
import { fileRoutePath } from "@controller/FileController";
import { File } from "@prisma/client";

const { URL } = config;

export default function FileEntityToClientMap(file: File) {
    return {
        ...file,
        contentUrl: `${URL}${fileRoutePath}`.replace(":id", file.id)
    }
}