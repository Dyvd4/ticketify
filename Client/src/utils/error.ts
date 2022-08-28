import { AxiosError } from "axios";

interface HandleErrorOptions {
    dontThrowError?: boolean
    dontHandleError?: boolean
}

export function handleError(error, options?: HandleErrorOptions) {
    if (!options?.dontThrowError) console.error(error);
    if (!options?.dontHandleError) {
        window.dispatchEvent(new CustomEvent("CustomError", { detail: { error } }));
    }
}

type MulterErrorMessage = "File too large" | "Unexpected field"

type MulterErrorMessageMap = {
    [key in MulterErrorMessage]: string
}

const multerErrorMessageMap: MulterErrorMessageMap = {
    "File too large": "File too large",
    "Unexpected field": "Too many pictures",
}

export function getMulterErrorMessage(error: AxiosError) {
    const unmappedErrorMessage = (error.response?.data as any).error as string;
    if (!unmappedErrorMessage.includes("MulterError")) return "";
    const multerErrorMessage = Object.keys(multerErrorMessageMap)
        .find(multerErrorMessage => {
            return unmappedErrorMessage.includes(multerErrorMessage);
        })
    return multerErrorMessage
        ? multerErrorMessageMap[multerErrorMessage]
        : unmappedErrorMessage.replace("MulterError:", "") as string || "";
}

export type ValidationErrorMap = {
    [key: string]: string
}

export function getValidationErrorMap({ response: { data: { validation, validations } } }): ValidationErrorMap {
    let errorDetails: any[] = [];
    const validationsToMap = validation
        ? [validation || {}]
        : validations || [];

    validationsToMap.forEach(validation => {
        if (validation?.error?.details) {
            errorDetails = errorDetails.concat(validation.error.details);
        }
    });
    const validationErrorMap = errorDetails.reduce((map, detail, index) => {
        if (index === 0) {
            map = {}
        }
        map[detail.context.key] = detail.message
        return map;
    }, {}) || {};
    if (validation?.message) validationErrorMap["Fieldless"] = validation.message;
    return validationErrorMap;
}

export function getValidationErrorMessages({ response: { data: { validation, validations } } }) {
    const mapErrorMessages = (validation) => validation.error.details.map(detail => detail.message)
    let errorMessages: any[] = [];
    const validationsToMap = validation
        ? [validation || {}]
        : validations || [];

    validationsToMap.forEach(validation => {
        if (validation?.message) errorMessages.push(validation.message);
        if (validation?.error?.details) {
            errorMessages = errorMessages.concat(mapErrorMessages(validation));
        }
    });
    return errorMessages;
}