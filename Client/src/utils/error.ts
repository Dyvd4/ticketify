import { AxiosError } from "axios";

interface HandleErrorOptions {
    postError?: boolean
}

export function handleError(error, options?: HandleErrorOptions) {
    window.dispatchEvent(new CustomEvent("CustomError", {
        detail: {
            options: options || {},
            error
        }
    }));
}

export const getErrorMessage = (error) => {
    return getMulterErrorMessage(error) || error.message;;
}

type MulterErrorMessage = "File too large" | "Unexpected field"

type MulterErrorMessageMap = {
    [key in MulterErrorMessage]: string
}

const multerErrorMessageMap: MulterErrorMessageMap = {
    "File too large": "File too large",
    "Unexpected field": "Too many files",
}

export function getMulterErrorMessage(error: AxiosError) {
    const unmappedErrorMessage = (error.response?.data as any)?.error || "" as string;
    if (!unmappedErrorMessage.includes("MulterError")) return "";
    const multerErrorMessage = Object.keys(multerErrorMessageMap)
        .find(multerErrorMessage => {
            return unmappedErrorMessage.includes(multerErrorMessage);
        })
    return multerErrorMessage
        ? multerErrorMessageMap[multerErrorMessage]
        : unmappedErrorMessage.replace("MulterError:", "") as string;
}

export type ValidationErrorMap = Partial<{
    [key: string]: string | string[]
    message: string
}>

// Copied from @nest/common
// don't want to install the whole package for the client
// only to get this type
interface ValidationError {
    /**
     * Object that was validated.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
     */
    target?: Record<string, any>;
    /**
     * Object's property that hasn't passed validation.
     */
    property: string;
    /**
     * Value that haven't pass a validation.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
     */
    value?: any;
    /**
     * Constraints that failed validation with error messages.
     */
    constraints?: {
        [type: string]: string;
    };
    /**
     * Contains all nested validation errors of the property.
     */
    children?: ValidationError[];
    /**
     * A transient set of data passed through to the validation result for response mapping
     */
    contexts?: {
        [type: string]: any;
    };
}

export type ValidationErrorResponse = {
    message: string
    statusCode: number
    error: {
        validation: {
            message: string
            items: ValidationError[]
        }
    }
}

/** @param key - the name of the field (for single field validations) */
export function getValidationErrorMap(error: AxiosError<ValidationErrorResponse>, key?: string): ValidationErrorMap | null {

    const validationErrorsToMap = error.response?.data.error.validation.items || [];
    const validationErrorMap = validationErrorsToMap.reduce((map, validationError, index) => {
        if (index === 0) {
            map = {}
        }
        map[key || validationError.property] = Object.keys(validationError.constraints || {}).map(key => {
            return validationError.constraints![key]
        })
        return map;
    }, {} as ValidationErrorMap);

    const validationMessage = error.response?.data.error.validation.message;
    if (validationMessage) validationErrorMap.message = validationMessage;

    console.debug(validationErrorsToMap)
    return Object.keys(validationErrorMap).length > 0
        ? validationErrorMap
        : null;
}
