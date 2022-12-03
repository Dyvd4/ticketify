import config from "@config";
import { File } from "@prisma/client";
import fsSync from "fs";
import fs, { mkdir } from "fs/promises";
import multer from "multer";
import path from "path";

const { FILE_IMAGE_MAX_SIZE_KB, FILE_IMAGE_MAX_COUNT, FILE_MAX_COUNT, FILE_MAX_SIZE_KB } = config;
const FILE_IMAGE_MAX_SIZE_B = FILE_IMAGE_MAX_SIZE_KB * 1000;
const FILE_MAX_SIZE_B = FILE_MAX_SIZE_KB * 1000;

const imageTypes = /jpeg|jpg|png/;
const uploadPath = path.join(__dirname, "../../upload");

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

export const isImageFile = (file) => {
    const isImageFile = imageTypes.test(path.extname(file.originalname).toLowerCase());
    return isImageFile;
}

export const validateFiles = (req, res, next) => {
    next();
}

export const validateImageFiles = (req, res, next) => {
    const files = req.files;
    let error: Error | undefined;
    for (const file of files) {
        if (!isImageFile(file)) {
            error = new Error(`MulterError: FileUpload only supports the following fileType: ${imageTypes}`);
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

const fileName = (file) => `${file.id}_${file.originalFileName || ""}`;

/** @returns filePath */
export const uploadFile = async (file) => {
    if (!fsSync.existsSync(uploadPath)) await mkdir(uploadPath)
    const filePath = path.join(uploadPath, fileName(file));
    await fs.writeFile(filePath, file.content);
    return filePath;
}

export const mapFile = (file: File, contentType: BufferEncoding) => {
    return {
        ...file,
        content: file.content.toString(contentType)
    }
}