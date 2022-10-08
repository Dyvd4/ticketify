import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { request } from "src/services/request";
import { getMulterErrorMessage, handleError } from "src/utils/error";

const getErrorMessage = (error) => {
    return getMulterErrorMessage(error) || error.message;;
}

export function useErrorHandler() {
    const toast = useToast();
    window.onerror = e => {
        handleError(String(e), { postError: true });
    }
    window.addEventListener("CustomError", e => {
        const { error, options } = e.detail;
        if (options.postError) request().post("Error", { error });
        if (error instanceof AxiosError && error.response?.status !== 500) return
        toast({
            title: "An unkown error occurred",
            description: getErrorMessage(error),
            status: "error",
            duration: 6000
        });
    })
}