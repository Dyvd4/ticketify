import { getCurrentUser } from "../services/currentUser";

export const userSignature = async (params, next) => {
    const currentUser = getCurrentUser();
    if (params.action === "create") {
        params.args.data.createUser = currentUser?.username || "NotSignedIn"
        params.args.data.updateUser = currentUser?.username || "NotSignedIn"
    }
    if (params.action === "update") {
        params.args.data.updateUser = currentUser?.username || "NotSignedIn"
    }
    return (await next(params));
}
