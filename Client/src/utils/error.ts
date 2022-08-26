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

export type ValidationErrorMap = {
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