import { useToast } from "@chakra-ui/react";
import { request } from "src/services/request";
import { handleError } from "src/utils/error";

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
            description: error.message,
            status: "error",
            duration: 6000,
            isClosable: true
        })
    })
}