import { useEffect, useState } from "react";
import { request } from "src/services/request";

/** 
 * uses `imageUrl` to request api with authentication
 * @returns image's object url
 * */
const useGetProtectedImageUrl = (imageRequestRoute: string, disable?: boolean) => {

    const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (disable) return;
        (async () => {
            const response = await request().get(imageRequestRoute, { responseType: "blob" });
            const imageObjectUrl = URL.createObjectURL(response.data);
            setImageObjectUrl(imageObjectUrl)
        })()
    }, [disable]);

    return [imageObjectUrl, setImageObjectUrl]
}

export default useGetProtectedImageUrl;