import { AxiosRequestConfig } from "axios";
import { request } from "../services/request";

const myRequest = request();

export type FetchEntityParams = {
    route: string,
    options?: AxiosRequestConfig
} & ({
    entityId?: string
    queryParams?: never
} | {
    queryParams?: any
    entityId?: never
})

export async function fetchEntity({ route, options, ...args }: FetchEntityParams) {
    let mappedRoute = `${route}`;
    if ("entityId" in args) mappedRoute += `/${args.entityId}`;
    else if ("queryParams" in args) {
        const tempURL = new URL(window.location.origin);
        Object.keys(args.queryParams).forEach(key => {
            tempURL.searchParams.set(key, typeof args.queryParams[key] === "object"
                ? JSON.stringify(args.queryParams[key])
                : args.queryParams[key]);
        });
        mappedRoute += `/?${tempURL.searchParams.toString()}`;
    }
    const response = await myRequest.get(mappedRoute, options);
    return response.data;
}

export interface AddEntityParams {
    route: string
    payload: any,
    options?: AxiosRequestConfig
}

export async function addEntity({ route, payload, options }: AddEntityParams) {
    const response = await myRequest.post(`${route}`, payload, options);
    return response;
}

export interface UpdateEntityParams {
    route: string
    entityId: string
    payload: any
    options?: AxiosRequestConfig
}

export async function updateEntity({ route, entityId, payload, options }: UpdateEntityParams) {
    const response = await myRequest.put(`${route}/${entityId}`, payload, options);
    return response;
}

export interface RemoveEntityParams {
    route: string
    entityId?: string
    options?: AxiosRequestConfig
}

export function removeEntity({ route, entityId, options }: RemoveEntityParams) {
    if (entityId) return myRequest.delete(`${route}/${entityId}`, options);
    return myRequest.delete(`${route}`, options);
}