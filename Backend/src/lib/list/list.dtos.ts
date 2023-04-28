import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { FilterOperationsType, FilterQueryParam, OrderByQueryParam } from "./list";

type MappedFilterOperation = Required<Pick<FilterQueryParam, "operation">>["operation"]
class FilterOperationDto implements MappedFilterOperation {
	@IsString()
	value!: string;
}

type MappedOrderByDirection = Pick<OrderByQueryParam, "direction">["direction"]
class OrderByDirectionDto implements MappedOrderByDirection {
	@IsString()
	label!: string;
	@IsString()
	value!: "desc" | "asc";
}

class FilterDto implements FilterQueryParam {
	@IsString()
	type!: FilterOperationsType;
	@IsString()
	property!: string;
	@IsString() @IsOptional()
	value?: string;
	@IsOptional() @ValidateNested()
	operation?: FilterOperationDto;
	@IsBoolean() @IsOptional()
	disabled?: boolean;
}

class OrderByDto implements OrderByQueryParam {
	@IsString()
	property!: string;
	@IsObject()
	direction!: OrderByDirectionDto
	@IsObject()
	disabled!: boolean
}

export class InfiniteLoaderQueryDto {
	@IsOptional() @ValidateNested({ each: true })
	filter?: FilterDto[]
	@IsArray() @IsOptional()
	orderBy?: OrderByDto[]
	@IsNumber()
	skip!: number
}

export class PagerQueryDto {
	@IsArray() @IsOptional()
	filter?: FilterDto[]
	@IsArray() @IsOptional()
	orderBy?: OrderByDto[]
	@IsNumber()
	page!: number
	@IsNumber() @IsOptional()
	itemsPerPage?: number
}