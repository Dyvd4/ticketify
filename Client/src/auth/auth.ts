import Cookies from "js-cookie";
import { request } from "../services/request";

const myRequest = request();

export const signIn = async (username: string, password: string) => {
    const response = await myRequest.post("auth/signIn", { username, password });
    if (response.status === 200) {
        const { authToken } = response.data;
        Cookies.set("auth-token", authToken);
    }
    return response;
}

export const signUp = async (username: string, email: string, password: string) => {
    const response = await myRequest.post("auth/signUp", { username, email, password });
    if (response.status === 200) {
        const { authToken } = response.data;
        Cookies.set("auth-token", authToken);
    }
    return response;
}

export const signOut = () => {
    Cookies.set("auth-token", "");
    window.location.href = "/";
}

export const isAuthenticated = (user) => !!user && user.emailConfirmed;
export const isAuthorized = (user) => isAuthenticated(user);