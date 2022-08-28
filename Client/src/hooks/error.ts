import { useToast } from "@chakra-ui/react";
import { request } from "src/services/request";
import { getMulterErrorMessage, handleError } from "src/utils/error";

const getErrorMessage = (error) => {
    return getMulterErrorMessage(error) || error.message;;
}

export function useErrorHandler() {
    const toast = useToast();
    window.onerror = e => {
        handleError(String(e), { dontThrowError: true });
    }
    window.onunhandledrejection = (e: PromiseRejectionEvent) => {
        handleError(String(e.reason), { dontThrowError: true });
    }
    window.addEventListener("CustomError", e => {
        const { error } = e.detail;
        request().post("Error", { error });
        toast({
            title: "An unkown error occurred",
            description: getErrorMessage(error),
            status: "error",
            duration: 6000
        })
    })
}