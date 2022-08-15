import Cookies from "js-cookie";
import { request } from "../services/request";

const myRequest = request({
    validateStatus: (status) => {
        return status < 500
    }
});

export const signIn = async (username: string, password: string) => {
    const response = await myRequest.post("auth/signIn", { username, password });
    if (response.status === 200) {
        const { authToken } = response.data;
        Cookies.set("auth-token", authToken);
    }
    return response;
}

export const signUp = async (username: string, password: string) => {
    const response = await myRequest.post("auth/signUp", { username, password });
    if (response.status === 200) {
        const { authToken } = response.data;
        Cookies.set("auth-token", authToken);
    }
    return response;
}