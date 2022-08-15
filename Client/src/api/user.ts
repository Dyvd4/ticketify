import { request } from "../services/request";

const myRequest = request({
    validateStatus: (status) => {
        return status < 500
    }
});

export async function fetchUser() {
    let user = null;
    const response = await myRequest.get("User");
    if (response.status === 200) user = response.data.user;
    return { user };
}