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
    [key: string]: string
    files: string
    Fieldless: string
}>

/** @param key - the name of the field (for single field validations) */
export function getValidationErrorMap(error, key?: string): ValidationErrorMap | null {
    const { response: { data: { validation, validations } } } = error;
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
        map[key || detail.context.key] = detail.message
        return map;
    }, {});

    const fieldLessValidationMessage = validation?.message || validation?.arbitrary?.message
    if (fieldLessValidationMessage) validationErrorMap["Fieldless"] = fieldLessValidationMessage;

    if (validation?.arbitrary) {
        Object.keys(validation.arbitrary)
            .filter(key => key !== "message")
            .forEach((key) => {
                validationErrorMap[key] = validation.arbitrary[key];
            });
    }

    return Object.keys(validationErrorMap).length > 0
        ? validationErrorMap
        : null;
}

export function getValidationErrorMessages(error) {
    const { response: { data: { validation, validations } } } = error;
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