import { ParseFilePipeBuilder } from "@nestjs/common";
import config from "@src/config";
import multer from "multer";
import crypto from "crypto"
import { Request } from "express";

const { FILE_IMAGE_MAX_SIZE_KB, FILE_MAX_SIZE_KB, FILE_UPLOAD_PATH, VALID_IMAGETYPES_REGEX } = config();
const FILE_IMAGE_MAX_SIZE_B = FILE_IMAGE_MAX_SIZE_KB * 1000;
const FILE_MAX_SIZE_B = FILE_MAX_SIZE_KB * 1000;

// TODO: replace with s3
export const diskStorage = multer.diskStorage({
	destination: FILE_UPLOAD_PATH,
	filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
		cb(null, `${crypto.randomUUID()}_${file.originalname}`)
	}
})

export const parseFilePipe = new ParseFilePipeBuilder()
	.addMaxSizeValidator({
		maxSize: FILE_MAX_SIZE_B
	})
	.build()

export const parseImageFilePipe = new ParseFilePipeBuilder()
	.addMaxSizeValidator({
		maxSize: FILE_IMAGE_MAX_SIZE_B
	})
	.addFileTypeValidator({
		fileType: new RegExp(VALID_IMAGETYPES_REGEX)
	})
	.build()