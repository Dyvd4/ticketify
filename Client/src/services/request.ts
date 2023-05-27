import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { handleError } from "../utils/error";

const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends AxiosRequestConfig {
    /** determines wether an error is thrown or not */
    dontThrowError?: boolean;
}

const ignoreErrorCodes = ["ERR_NETWORK"];

export const request = (options?: RequestOptions) => {
    options = {
        baseURL: API_URL,
        withCredentials: true,
        ...options,
    };
    if (options.dontThrowError) options.validateStatus = () => true;
    const instance = axios.create(options);
    instance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => handleError(error)
    );
    instance.interceptors.response.use(
        (config) => {
            return config;
        },
        (error) => {
            if (
                error instanceof AxiosError &&
                (error.response?.status !== 401 || !ignoreErrorCodes.includes(error.code || ""))
            ) {
                handleError(error);
            }
            return Promise.reject(error);
        }
    );
    return instance;
};
