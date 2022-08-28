import { request } from "../services/request"

const myRequest = request({
    validateStatus: (status) => {
        return status < 500
    }
});

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
    return response;
}

interface UpdateEntityParams {
    route: string
    entityId: string
    payload: any
}

export async function updateEntity({ route, entityId, payload }: UpdateEntityParams) {
    const response = await myRequest.put(`${route}/${entityId}`, { payload });
    return response;
}

interface RemoveEntityParams {
    route: string
    entityId: string
}

export function removeEntity({ route, entityId }: RemoveEntityParams) {
    return myRequest.delete(`${route}/${entityId}`);
}