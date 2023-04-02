import { MaxFileSizeValidator, MaxFileSizeValidatorOptions } from "@nestjs/common";

export class CustomMaxFileSizeValidator extends MaxFileSizeValidator {
	
	constructor(validationOptions: MaxFileSizeValidatorOptions) {
		super(validationOptions);
	}

	buildErrorMessage(): string {
		return `Validation failed (expected size is less than ${this.validationOptions.maxSize / 1000000} MB)`;
	}
	
}