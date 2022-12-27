import config from "@config";
import FailedValidationResponse from "@lib/responses/FailedValidationResponse";
import { isImageFile } from "@lib/utils/FileUtils";
import { Request, Response } from "express";
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

const multerErrorMessageMap: Partial<Record<multer.ErrorCode, string>> = {
    "LIMIT_FILE_SIZE": "File too large",
    "LIMIT_UNEXPECTED_FILE": "Too many files",
}

/** sends a mapped response for multer errors back, otherwise executes the callback. */
export const withErrorHandling = (
    req: Request,
    res: Response, cb: () => void,
    type: "file-upload" | "image-upload" = "file-upload") => {
    return [
        req,
        res,
        (error) => {
            if (error instanceof multer.MulterError) {
                let mappedErrorMessage: string | undefined;

                if (error.code === "LIMIT_FILE_SIZE") {
                    mappedErrorMessage = `${multerErrorMessageMap.LIMIT_FILE_SIZE}. Maximum of ${type === "file-upload" ? FILE_MAX_SIZE_KB : FILE_IMAGE_MAX_SIZE_KB} KB expected`;
                }
                else if (error.code === "LIMIT_UNEXPECTED_FILE") {
                    mappedErrorMessage = `${multerErrorMessageMap.LIMIT_UNEXPECTED_FILE}. Maximum of ${type === "file-upload" ? `${FILE_MAX_COUNT} files` : `${FILE_IMAGE_MAX_COUNT} images`} expected.`
                }
                else {
                    mappedErrorMessage = multerErrorMessageMap[error.code]
                }

                return res.status(400).json(new FailedValidationResponse(mappedErrorMessage || "Unknown file-upload error"))
            }
            else {
                cb();
            }
        }
    ] as const
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