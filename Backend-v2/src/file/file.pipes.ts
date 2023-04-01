import { ParseFilePipeBuilder } from "@nestjs/common";

const { FILE_IMAGE_MAX_SIZE_KB, FILE_MAX_SIZE_KB, VALID_IMAGETYPES_REGEX } = process.env;
const FILE_IMAGE_MAX_SIZE_B = parseInt(FILE_IMAGE_MAX_SIZE_KB!) * 1000;
const FILE_MAX_SIZE_B = parseInt(FILE_MAX_SIZE_KB!) * 1000;

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
		fileType: new RegExp(VALID_IMAGETYPES_REGEX!)
	})
	.build()