import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";

class NestedObj {
	@IsBoolean()
	@Transform(({ obj, key }) => obj[key] === "true")
	nestedProp!: boolean;
	@IsArray()
	someNestedArrProp!: string[];
}

export class SomeObjDto {
	@IsNumber()
	prop!: number;
	@IsObject()
	@ValidateNested()
	nestedObj!: NestedObj;
}

export class DummyDto {
	@IsString()
	oneProp!: string;
}
