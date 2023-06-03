import Cookies from "js-cookie";
import { request } from "../services/request";
import { RoleName } from "./AuthenticatedArea";

const myRequest = request();

export const signIn = async (username: string, password: string) => {
	const response = await myRequest.post("auth/signIn", { username, password });
	if (response.status === 201) {
		const { authToken } = response.data;
		Cookies.set("auth-token", authToken);
	}
	return response;
};

export const signUp = async (username: string, email: string, password: string) => {
	const response = await myRequest.post("auth/signUp", { username, email, password });
	if (response.status === 201) {
		const { authToken } = response.data;
		Cookies.set("auth-token", authToken);
	}
	return response;
};

export const signOut = async () => {
	Cookies.remove("auth-token");
	const response = await myRequest.post("auth/signOut");
	return response;
};

export const hasEmailConfirmation = (user) => user.emailConfirmed;
export const isAuthorizedForRole = (user, roleName: RoleName) => {
	if (!hasEmailConfirmation(user)) return false;
	const userRoleName = user.role.name as RoleName;
	if (userRoleName === "super-admin") {
		return true;
	}
	if (userRoleName === "admin" && roleName !== "super-admin") {
		return true;
	}
	return userRoleName === roleName;
};
