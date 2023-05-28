import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {
	@ApiProperty({ type: "string", format: "binary" })
	file!: Express.Multer.File;
}

export class UploadFilesDto {
	@ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
	files!: Express.Multer.File[];
}
