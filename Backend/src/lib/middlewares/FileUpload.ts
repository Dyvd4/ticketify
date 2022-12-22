import config from "@config";
import { isImageFile } from "@lib/utils/FileUtils";
import multer from "multer";

const { FILE_IMAGE_MAX_SIZE_KB, FILE_IMAGE_MAX_COUNT, FILE_MAX_COUNT, FILE_MAX_SIZE_KB, FILE_UPLOAD_PATH } = config;
const FILE_IMAGE_MAX_SIZE_B = FILE_IMAGE_MAX_SIZE_KB * 1000;
const FILE_MAX_SIZE_B = FILE_MAX_SIZE_KB * 1000;

export const imageUpload = multer({
    limits: {
        fileSize: FILE_IMAGE_MAX_SIZE_B
    },
    storage: multer.diskStorage({
        destination: FILE_UPLOAD_PATH
    })
}).array("files", FILE_IMAGE_MAX_COUNT);

export const fileUpload = multer({
    limits: {
        fileSize: FILE_MAX_SIZE_B
    },
    storage: multer.diskStorage({
        destination: FILE_UPLOAD_PATH
    })
}).array("files", FILE_MAX_COUNT);

export const validateFiles = (req, res, next) => {
    next();
}

export const validateImageFiles = (req, res, next) => {
    const files = req.files;
    let error: Error | undefined;
    for (const file of files) {
        if (!isImageFile(file)) {
            error = new Error(`MulterError: FileUpload only supports the following fileType regex: ${config.VALID_IMAGETYPES_REGEX}`);
        }
        if (error) break;
    }
    if (error) {
        return res.status(500).json({
            error: String(error)
        });
    }
    next();
}

export default {
    imageUpload,
    fileUpload,
    validateImageFiles,
    validateFiles
}