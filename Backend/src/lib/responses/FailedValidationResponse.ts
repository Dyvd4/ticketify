import { ValidationResult } from "joi";

type ValidationResponse = ValidationResult | {
    message: string
}

export default class FailedValidationResponse {

    validation: ValidationResponse
    validations: ValidationResult[]

    constructor(validationResult: ValidationResult)
    constructor(validationResults: ValidationResult[])
    constructor(message: string)
    constructor(messageOrValidationResult: string | ValidationResult | ValidationResult[]) {
        if (typeof messageOrValidationResult === "string") {
            this.validation = {
                message: messageOrValidationResult
            }
        }
        else if ("length" in messageOrValidationResult) {
            this.validations = messageOrValidationResult;
        }
        else {
            this.validation = messageOrValidationResult;
        }
    }
}
