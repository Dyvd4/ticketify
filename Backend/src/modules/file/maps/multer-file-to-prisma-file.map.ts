import { Prisma } from "@prisma/client";

export const MulterFileToPrismaFileMap = (file: Express.Multer.File) => {
    return {
        fileName: file.filename || file.originalname,
        originalFileName: file.originalname,
        mimeType: file.mimetype,
    } satisfies Prisma.FileCreateInput;
};

export type PrismaFile = ReturnType<typeof MulterFileToPrismaFileMap>;
