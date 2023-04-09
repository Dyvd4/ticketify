import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { request } from "src/services/request";
import { handleError } from "src/utils/error";

export function useErrorHandler() {

    const toast = useToast();

    window.onerror = (e, source, lineNo, colNo, error) => {
        if (!error) return;
        handleError(error, { postError: true });
    }

    window.addEventListener("CustomError", e => {
        const { error, options } = e.detail;
        if (options?.postError) {
            request().post("log/error", {
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            });
        }
        if (error instanceof AxiosError && error.response?.status !== 500) return
        toast({
            title: "An unknown error occurred",
            description: error.message,
            status: "error",
            duration: 6000
        });
    });
}