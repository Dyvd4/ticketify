import { FileTypeValidator, HttpStatus, ParseFilePipe } from "@nestjs/common";
import { ValidationException } from "@src/modules/global/validation.exception";
import { CustomMaxFileSizeValidator } from "./custom-max-file-size.validator";
import dotenv from "dotenv";
dotenv.config()

const { VALID_IMAGETYPES_REGEX } = process.env;
const FILE_IMAGE_MAX_SIZE_KB = parseInt(process.env.FILE_IMAGE_MAX_SIZE_KB!);
const FILE_MAX_SIZE_KB = parseInt(process.env.FILE_MAX_SIZE_KB!);
const FILE_IMAGE_MAX_SIZE_B = FILE_IMAGE_MAX_SIZE_KB * 1000;
const FILE_MAX_SIZE_B = FILE_MAX_SIZE_KB * 1000;

export const parseFilePipe = new ParseFilePipe({
	validators: [new CustomMaxFileSizeValidator({ maxSize: FILE_MAX_SIZE_B, format: "megabyte" })],
	errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
	exceptionFactory(error) {
		return new ValidationException(error);
	}
});

export const parseImageFilePipe = new ParseFilePipe({
	validators: [
		new CustomMaxFileSizeValidator({ maxSize: FILE_IMAGE_MAX_SIZE_B, format: "megabyte" }),
		new FileTypeValidator({ fileType: new RegExp(VALID_IMAGETYPES_REGEX!) })
	],
	errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
	exceptionFactory(error) {
		return new ValidationException(error);
	}
})