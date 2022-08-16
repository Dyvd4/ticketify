import { request } from "../services/request";


interface handleErrorOptions {
    dontThrowError?: boolean
    dontHandleError?: boolean
}

export function handleError(error, options?: handleErrorOptions) {
    if (!options?.dontThrowError) console.error(error);
    if (!options?.dontHandleError) {
        window.dispatchEvent(new CustomEvent("CustomError", { detail: { error } }));
    }
}

export function setupErrorHandler() {
    window.onerror = e => {
        handleError(String(e), { dontThrowError: true });
    }
    window.onunhandledrejection = (e: PromiseRejectionEvent) => {
        handleError(String(e.reason), { dontThrowError: true });
    }
    window.addEventListener("CustomError", e => {
        const { error } = e.detail;
        request().post("Error", { error });
        // now display it elsewhere
    })
}

type ValidationErrorMap = {
    [key: string]: string
}

export function getValidationErrorMap({ response: { data: { validation } } }): ValidationErrorMap {
    const validationErrorMap = validation.error?.details?.reduce((map, detail, index) => {
        if (index === 0) {
            map = {}
        }
        map[detail.context.key] = detail.message
        return map;
    }, {}) || {};
    if (validation.message) validationErrorMap["Fieldless"] = validation.message;
    return validationErrorMap;
}

export function getValidationError({ response: { data: { validation } } }) {
    let validationError = validation.message ||
        validation.error?.details?.map(detail => detail.message)
    return validationError;
}