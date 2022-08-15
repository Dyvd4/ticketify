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

export function addEntity({ route, payload }: AddEntityParams) {
    return myRequest.post(`${route}`, { payload });
}

interface UpdateEntityParams {
    route: string
    entityId: string
    payload: any
}

export function updateEntity({ route, entityId, payload }: UpdateEntityParams) {
    return myRequest.put(`${route}/${entityId}`, { payload });
}

interface RemoveEntityParams {
    route: string
    entityId: string
}

export function removeEntity({ route, entityId }: RemoveEntityParams) {
    return myRequest.delete(`${route}/${entityId}`);
}