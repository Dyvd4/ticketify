import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ParseParamPipe implements PipeTransform {
	transform(value: any, { type: decoratorType }: ArgumentMetadata) {
		if (decoratorType === "param" && typeof value === "string" && value === ",") {
			value = "";
		}

		return value;
	}
}
