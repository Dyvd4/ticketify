import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { REACT_APP_DOMAIN } from "../env.local";
import Cookies from "js-cookie";
import { handleError } from "../utils/error";

interface RequestOptions extends AxiosRequestConfig {
    /** determines wheter an error is thrown or not */
    dontThrowError?: boolean
}

const ignoreErrorCodes = [
    "ERR_NETWORK"
]

export const request = (options?: RequestOptions) => {
    options = {
        ...options,
        baseURL: REACT_APP_DOMAIN,
        headers: {
            "auth-token": Cookies.get("auth-token") || ""
        }
    }
    if (options.dontThrowError) options.validateStatus = () => true;
    const instance = axios.create(options);
    instance.interceptors.request.use((config) => {
        return config
    }, (error) => handleError(error, { dontThrowError: true }));
    instance.interceptors.response.use((config) => {
        return config
    }, (error) => {
        if (error instanceof AxiosError &&
            (error.response?.status === 401 || ignoreErrorCodes.includes(error.code || ""))) {
            return;
        }
        handleError(error, { dontThrowError: true })
        return Promise.reject(error);
    });
    return instance;
};