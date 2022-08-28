import { request } from "src/services/request";

const myRequest = request({
    validateStatus: (status) => {
        return status < 500
    }
});

export const addFiles = async (files: FileList, type?: "image" | "file") => {
    const route = type && type === "image"
        ? "images"
        : "files";
    const formData = new FormData();
    Array.from(files!).forEach(file => {
        formData.append("files", file);
    })
    const response = await myRequest.post(route, formData)
    if (!response) return null;
    return response;
}

export const updateFile = async (file: File, fileId: string, type?: "image" | "file") => {
    const route = type && type === "image"
        ? "image"
        : "file";
    const formData = new FormData();
    formData.append("files", file);
    const response = await myRequest.put(`${route}/${fileId}`, formData)
    if (!response) return null;
    return response;
}