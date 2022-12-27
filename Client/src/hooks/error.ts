import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { request } from "src/services/request";
import { getErrorMessage, handleError } from "src/utils/error";

export function useErrorHandler() {

    const toast = useToast();

    window.onerror = (e, source, lineNo, colNo, error) => {
        handleError({
            message: error?.message,
            stack: error?.stack
        }, { postError: true });
    }

    window.addEventListener("CustomError", e => {
        const { error, options } = e.detail;
        if (options.postError) request().post("Error", { error });
        if (error instanceof AxiosError && error.response?.status !== 500) return
        toast({
            title: "An unknown error occurred",
            description: getErrorMessage(error),
            status: "error",
            duration: 6000
        });
    });
}