import { ValidationResult } from "joi";

type ArbitraryValidationResult = string | Partial<{
    [key: string]: string
    files: string
}>

type ArbitraryValidationResponse = {
    arbitrary: Partial<{
        [key: string]: string
        message: string
        files: string
    }>
}

export default class FailedValidationResponse {

    validation: ArbitraryValidationResponse | ValidationResult;
    validations: ValidationResult[]

    constructor(validationResult: ValidationResult)
    constructor(validationResults: ValidationResult[])
    constructor(arbitraryValidationResult: ArbitraryValidationResult)
    constructor(arbitraryOrJoiValidationResult: ArbitraryValidationResult | ValidationResult | ValidationResult[]) {
        if (isArbitraryValidationResult(arbitraryOrJoiValidationResult)) {
            if (typeof arbitraryOrJoiValidationResult === "string") {
                this.validation = {
                    arbitrary: {
                        message: arbitraryOrJoiValidationResult
                    }
                }
            }
            else {
                this.validation = {
                    arbitrary: arbitraryOrJoiValidationResult
                }
            }
        }
        else if (isValidationResultArray(arbitraryOrJoiValidationResult)) {
            this.validations = arbitraryOrJoiValidationResult;
        }
        else {
            this.validation = arbitraryOrJoiValidationResult;
        }
    }
}


const isValidationResult = (validationResult): validationResult is ValidationResult => {
    return typeof validationResult === "object" &&
        validationResult.error &&
        validationResult.error.name === "ValidationError";
}

const isValidationResultArray = (validationResult): validationResult is ValidationResult[] => {
    return typeof validationResult === "object" && "length" in validationResult;
}

const isArbitraryValidationResult = (validationResult): validationResult is ArbitraryValidationResult => {
    return !isValidationResult(validationResult) && !isValidationResultArray(validationResult)
}