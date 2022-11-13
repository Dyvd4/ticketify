import { request } from "../services/request";

const validStatuses = [200, 401]

const myRequest = request({
    validateStatus: (status) => validStatuses.includes(status)
});

export async function fetchCurrentUser() {
    let user: any = null;
    const response = await myRequest.get("user");
    if (response.status === 200) user = response.data;
    return user;
}

export async function fetchCurrentUserAll() {
    let user: any = null;
    const response = await myRequest.get("user/all");
    if (response.status === 200) user = response.data;
    return user;
}