import dotenv from "dotenv";
import multer from "multer";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const FILE_IMAGE_MAX_SIZE_B = parseInt(process.env.FILE_IMAGE_MAX_SIZE_KB!) * 1000;
const FILE_IMAGE_MAX_COUNT = parseInt(process.env.FILE_IMAGE_MAX_COUNT!);
const FILE_MAX_SIZE_B = parseInt(process.env.FILE_MAX_SIZE_KB!) * 1000;
const FILE_MAX_COUNT = parseInt(process.env.FILE_MAX_COUNT!);

export const imageUpload = multer({
    limits: {
        fileSize: FILE_IMAGE_MAX_SIZE_B
    }
}).array("files", FILE_IMAGE_MAX_COUNT);

export const fileUpload = multer({
    limits: {
        fileSize: FILE_MAX_SIZE_B
    }
}).array("files", FILE_MAX_COUNT);

const checkImageFileExtension = (file) => {
    const fileTypes = /jpeg|jpg|png/;
    const fileExtensionValid = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (!fileExtensionValid) {
        return new Error(`MulterError: FileUpload only supports the following fileType: ${fileTypes}`);
    }
}

export const validateFiles = (req, res, next) => {
    next();
}

export const validateImageFiles = (req, res, next) => {
    const files = req.files;
    let error: Error | undefined;
    for (const file of files) {
        error = checkImageFileExtension(file);
        if (error) break;
    }
    if (error) {
        return res.status(500).json({
            error: String(error)
        });
    }
    next();
}
