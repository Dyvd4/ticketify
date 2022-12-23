import config from "@config";
import MulterFileToFileEntityMap from "@core/maps/MulterFileToFileEntityMap";
import FileSchema from "@core/schemas/FileSchema";
import prisma from "@prisma";
import { File } from "@prisma/client";
import fs from "fs/promises";

const { FILE_UPLOAD_PATH } = config;

type MappedMulterFile = ReturnType<typeof MulterFileToFileEntityMap>

export const validateAndCreateFiles = async (filesToCreate: MappedMulterFile[]) => {

    const failedFileValidations = filesToCreate.map(file => {
        const validation = FileSchema.validate(file);
        if (validation.error) return { file, validation };
    }).filter(Boolean)

    if (failedFileValidations.length > 0) {
        await Promise.all(failedFileValidations.map((validation) => (async () => {
            return fs.rm(getFilePath(validation!.file)); // remove already created file
        })()));
        return {
            validations: failedFileValidations.map(validation => validation!.validation)
        };
    }

    const newFiles = await Promise.all(filesToCreate.map(file => {
        return prisma.file.create({
            data: file
        });
    }));

    return newFiles;
}

export const validateAndUpdateFile = async (id: string, fileToUpdate: MappedMulterFile) => {

    const validation = FileSchema.validate(fileToUpdate);

    if (validation.error) {
        await fs.rm(getFilePath(fileToUpdate)); // remove already created file
        return { validation }
    }

    const fileDb = await prisma.file.findUnique({
        where: {
            id
        }
    });

    if (!fileDb) {
        await fs.rm(getFilePath(fileToUpdate)); // remove already created file
        return {
            validation: {
                message: `file with id: ${id} not found`
            }
        };
    }

    await fs.rm(getFilePath(fileDb));

    const updatedFile = await prisma.file.update({
        where: {
            id
        },
        data: fileToUpdate
    });

    return updatedFile;
}

export const validateAndDeleteFile = async (id: string) => {

    const fileDb = await prisma.file.findUnique({
        where: {
            id
        }
    });

    if (!fileDb) {
        return {
            validation: {
                message: `No file found with id: ${id}`
            }
        }
    }

    await fs.rm(getFilePath(fileDb));

    const deletedItem = await prisma.file.delete({
        where: {
            id
        }
    });

    return deletedItem;
}

/** @returns filePath */
export const getFilePath = (file: Pick<File, "fileName">) => {
    const filePath = `${FILE_UPLOAD_PATH}/${file.fileName}`
    return filePath;
}

export default {
    getFilePath,
    validateAndCreateFiles,
    validateAndUpdateFile,
    validateAndDeleteFile
}