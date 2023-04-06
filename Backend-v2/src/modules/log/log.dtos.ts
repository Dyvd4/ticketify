import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator"

class ErrorDto implements Error {
	@IsString() @IsNotEmpty()
	name!: string
	@IsString() @IsNotEmpty()
	message!: string
	@IsString() @IsOptional()
	stack?: string
}

export class CreateErrorLogDto {
	@IsObject() @ValidateNested()
	error!: ErrorDto
}