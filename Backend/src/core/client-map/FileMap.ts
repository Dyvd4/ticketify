import { File } from "@prisma/client";

export default function FileMap(file: File, contentType: BufferEncoding) {
    return {
        ...file,
        content: file.content.toString(contentType)
    }
}