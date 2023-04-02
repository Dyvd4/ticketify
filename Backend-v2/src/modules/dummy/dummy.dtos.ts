import { IsArray, IsObject, IsString, ValidateNested } from "class-validator";

class NestedObj {
	@IsString()
	someNestedProp!: string
	@IsArray()
	someNestedArrProp!: string[]
}

export class SomeObjDto {
	@IsString()
	randomProp!: string
	@IsString()
	anotherProp!: string
	@IsObject() @ValidateNested()
	nestedObj!: NestedObj
}

export class DummyDto {
	@IsString()
	oneProp!: string
}