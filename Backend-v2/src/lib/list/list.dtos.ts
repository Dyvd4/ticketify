import { IsString, IsOptional, IsNumber } from "class-validator"

export class InfiniteLoaderQueryDto {
	@IsString() @IsOptional()
	filter?: string
	@IsString() @IsOptional()
	orderBy?: string
	@IsNumber()
	skip!: number
}

export class PagerQueryDto {
	@IsString() @IsOptional()
	filter?: string
	@IsString() @IsOptional()
	orderBy?: string
	@IsNumber()
	page!: number
}