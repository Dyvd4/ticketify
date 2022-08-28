import { AxiosRequestConfig } from "axios";
import { request } from "../services/request"

const myRequest = request({
    validateStatus: (status) => {
        return status < 500
    }
});

interface FetchEntityParams {
    route: string
    options?: AxiosRequestConfig
}
export async function fetchEntity({ route, options }: FetchEntityParams) {
    const response = await myRequest.get(`${route}`, options);
    return response.data;
}

interface AddEntityParams {
    route: string
    payload: any,
    options?: AxiosRequestConfig
}

export async function addEntity({ route, payload, options }: AddEntityParams) {
    const response = await myRequest.post(`${route}`, payload, options);
    return response;
}

interface UpdateEntityParams {
    route: string
    entityId: string
    payload: any
    options?: AxiosRequestConfig
}

export async function updateEntity({ route, entityId, payload, options }: UpdateEntityParams) {
    const response = await myRequest.put(`${route}/${entityId}`, payload, options);
    return response;
}

interface RemoveEntityParams {
    route: string
    entityId: string
    options?: AxiosRequestConfig
}

export function removeEntity({ route, entityId, options }: RemoveEntityParams) {
    return myRequest.delete(`${route}/${entityId}`, options);
}