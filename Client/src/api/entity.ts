import { AxiosRequestConfig } from "axios";
import qs from "qs";
import { request } from "../services/request";

const myRequest = request();

export type FetchEntityArgs = {
	route: string,
	options?: AxiosRequestConfig
} & ({
	entityId?: string
	queryParams?: never
} | {
	queryParams?: any
	entityId?: never
})

export async function fetchEntity({ route, options, ...args }: FetchEntityArgs) {
	let mappedRoute = `${route}`;
	if ("entityId" in args) {
		mappedRoute += `/${args.entityId}`;
	}
	else if ("queryParams" in args) {
		mappedRoute += `/?${qs.stringify(args.queryParams)}`;
	}
	const response = await myRequest.get(mappedRoute, options);
	return response.data;
}

export type AddEntityArgs = {
	route: string
	payload: any,
	options?: AxiosRequestConfig
}

export async function addEntity({ route, payload, options }: AddEntityArgs) {
	const response = await myRequest.post(`${route}`, payload, options);
	return response;
}

export type UpdateEntityArgs = {
	route: string
	entityId?: string
	payload: any
	options?: AxiosRequestConfig
}

export async function updateEntity({ route, entityId, payload, options }: UpdateEntityArgs) {
	if (entityId) return myRequest.patch(`${route}/${entityId}`, payload, options);
	return myRequest.patch(`${route}`, payload, options);
}

export type RemoveEntityArgs = {
	route: string
	entityId?: string
	options?: AxiosRequestConfig
}

export function removeEntity({ route, entityId, options }: RemoveEntityArgs) {
	if (entityId) return myRequest.delete(`${route}/${entityId}`, options);
	return myRequest.delete(`${route}`, options);
}