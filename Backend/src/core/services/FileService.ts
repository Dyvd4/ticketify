import config from "@config";
import MulterFileToFileEntityMap from "@core/maps/MulterFileToFileEntityMap";
import FileSchema from "@core/schemas/FileSchema";
import prisma from "@prisma";
import { File } from "@prisma/client";
import fs from "fs/promises";

const { FILE_UPLOAD_PATH } = config;

type MappedMulterFile = ReturnType<typeof MulterFileToFileEntityMap>

const validateFile = async (file: MappedMulterFile) => {
    const validation = FileSchema.validate(file);
    if (validation.error) {
        await fs.rm(getFilePath(file)); // remove already created file from multer
        return validation
    }
    return null
}

export const validateAndCreateFiles = async (filesToCreate: MappedMulterFile[]) => {

    const erroredFileValidations = (await Promise.all(filesToCreate.map(file => validateFile(file)))).filter(Boolean)

    if (erroredFileValidations.length > 0) {
        return { validations: erroredFileValidations };
    }

    const newFiles = await Promise.all(filesToCreate.map(file => {
        return prisma.file.create({
            data: file
        });
    }));

    return newFiles;
}

export const validateAndCreateFile = async (fileToCreate: MappedMulterFile) => {

    const erroredValidation = await validateFile(fileToCreate)

    if (erroredValidation) {
        return { validation: erroredValidation }
    }

    const newFile = await prisma.file.create({
        data: fileToCreate
    });

    return newFile;
}

export const validateAndUpdateFile = async (id: string, fileToUpdate: MappedMulterFile) => {

    const erroredValidation = await validateFile(fileToUpdate)

    if (erroredValidation) {
        return { validation: erroredValidation }
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
    validateAndCreateFile,
    validateAndUpdateFile,
    validateAndDeleteFile
}