import config from "@config";
import { isImageFile } from "@lib/utils/FileUtils";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuid } from "uuid";

const { FILE_IMAGE_MAX_SIZE_KB, FILE_IMAGE_MAX_COUNT, FILE_MAX_COUNT, FILE_MAX_SIZE_KB, FILE_UPLOAD_PATH } = config;
const FILE_IMAGE_MAX_SIZE_B = FILE_IMAGE_MAX_SIZE_KB * 1000;
const FILE_MAX_SIZE_B = FILE_MAX_SIZE_KB * 1000;

const imageFileFilterHandler = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const error = !isImageFile(file)
        ? new Error(`MulterError: FileUpload only supports the following fileType regex: ${config.VALID_IMAGETYPES_REGEX}`)
        : null;
    if (error) cb(error);
    else cb(null, true);
}

const fileNameHandler = (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${uuid()}_${file.originalname}`)
}

export const multipleImageUpload = multer({
    limits: {
        fileSize: FILE_IMAGE_MAX_SIZE_B
    },
    storage: multer.diskStorage({
        destination: FILE_UPLOAD_PATH,
        filename: fileNameHandler
    }),
    fileFilter: imageFileFilterHandler
}).array("files", FILE_IMAGE_MAX_COUNT);

export const singleImageUpload = multer({
    limits: {
        fileSize: FILE_IMAGE_MAX_SIZE_B
    },
    storage: multer.diskStorage({
        destination: FILE_UPLOAD_PATH,
        filename: fileNameHandler
    }),
    fileFilter: imageFileFilterHandler,
}).single("file");

export const multipleFileUpload = multer({
    limits: {
        fileSize: FILE_MAX_SIZE_B
    },
    storage: multer.diskStorage({
        destination: FILE_UPLOAD_PATH,
        filename: fileNameHandler
    })
}).array("files", FILE_MAX_COUNT);

export const singleFileUpload = multer({
    limits: {
        fileSize: FILE_MAX_SIZE_B
    },
    storage: multer.diskStorage({
        destination: FILE_UPLOAD_PATH,
        filename: fileNameHandler
    })
}).single("file");

export default {
    multipleImageUpload,
    multipleFileUpload,
    singleFileUpload,
    singleImageUpload
}