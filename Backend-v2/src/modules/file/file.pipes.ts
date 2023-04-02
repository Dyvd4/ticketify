import { FileTypeValidator, HttpStatus, ParseFilePipe } from "@nestjs/common";
import { ValidationException } from "@src/modules/global/global.validation.exception";
import { CustomMaxFileSizeValidator } from "./file.custom-max-file-size.validator";

// FIXME: should be gathered from env file
// but env variables cannot be loaded safely without config service
// as the config module is sometimes being loaded slightly later as this file
// and thus the variables are undefined sometimes
// so hardcoded it for now
const FILE_IMAGE_MAX_SIZE_KB = 1000;
const FILE_MAX_SIZE_KB = 2000;
const VALID_IMAGETYPES_REGEX = /jpeg|jpg|png/;
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