import { BadRequestException, HttpStatus } from "@nestjs/common"
import { ValidationError } from "class-validator";

type ValidationErrorResponse = {
	message: string
	statusCode: number
	error: {
		validation: {
			message?: string
			items: ValidationError[]
		}
	}
}

export class ValidationException extends BadRequestException {
	constructor(validationErrors: ValidationError[], message?: string) {
		super({
			message: "Bad Request",
			statusCode: HttpStatus.BAD_REQUEST,
			error: {
				validation: {
					message,
					items: validationErrors
				}
			}
		} satisfies ValidationErrorResponse);
	}
}
