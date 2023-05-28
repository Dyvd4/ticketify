import { BadRequestException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";

type ValidationErrorResponse = {
	message: string;
	statusCode: number;
	error: {
		validation: {
			message?: string;
			items: ValidationError[];
		};
	};
};

export class ValidationException extends BadRequestException {
	constructor(validationMessage: string);
	constructor(validationErrors: ValidationError[]);
	constructor(validationErrors: ValidationError[], validationMessage?: string);
	constructor(
		validationErrorsOrValidationMessage: string | ValidationError[],
		validationMessage?: string
	) {
		super({
			message: "Bad Request",
			statusCode: HttpStatus.BAD_REQUEST,
			error: {
				validation: {
					message: isValidationError(validationErrorsOrValidationMessage)
						? validationMessage
						: validationErrorsOrValidationMessage,
					items: isValidationError(validationErrorsOrValidationMessage)
						? validationErrorsOrValidationMessage
						: [],
				},
			},
		} satisfies ValidationErrorResponse);
	}
}

const isValidationError = (
	validationErrorsOrValidationMessage: string | ValidationError[]
): validationErrorsOrValidationMessage is ValidationError[] => {
	return (
		validationErrorsOrValidationMessage instanceof Array &&
		validationErrorsOrValidationMessage[0] instanceof ValidationError
	);
};
