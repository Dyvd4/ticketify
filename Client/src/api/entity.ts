import { request } from "../services/request"

const myRequest = request();

interface FetchEntityParams {
    route: string
}
export async function fetchEntity({ route }: FetchEntityParams) {
    const response = await myRequest.get(`${route}`);
    return response.data;
}

interface AddEntityParams {
    route: string
    payload: any
}

export async function addEntity({ route, payload }: AddEntityParams) {
    const response = await myRequest.post(`${route}`, { payload });
    return response.data;
}

interface UpdateEntityParams {
    route: string
    entityId: string
    payload: any
}

export async function updateEntity({ route, entityId, payload }: UpdateEntityParams) {
    const response = await myRequest.put(`${route}/${entityId}`, { payload });
    return response.data;
}

interface RemoveEntityParams {
    route: string
    entityId: string
}

export function removeEntity({ route, entityId }: RemoveEntityParams) {
    return myRequest.delete(`${route}/${entityId}`);
}