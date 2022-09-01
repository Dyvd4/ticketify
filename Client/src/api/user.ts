import { request } from "../services/request";

const myRequest = request({
    validateStatus: (status) => {
        return status < 500
    }
});

export async function fetchUser() {
    let user: any = null;
    const response = await myRequest.get("user");
    if (response.status === 200) user = response.data;
    return { user };
}

export async function fetchUserAll(){
    let user: any = null;
    const response = await myRequest.get("user/all");
    if (response.status === 200) user = response.data;
    return { user };
}