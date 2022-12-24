import { useEffect, useState } from "react";
import { request } from "src/services/request";

/** 
 * uses `imageRequestRoute` to optimistically request api with authentication in order to get the image and parse it
 * @returns image's object url
 * */
const useGetProtectedImageUrl = (imageRequestRoute: string, disable?: boolean) => {

    const [imageObjectUrl, setImageObjectUrl] = useState<string | undefined>();

    useEffect(() => {
        if (disable) return;
        (async () => {
            const response = await request().get(imageRequestRoute, { responseType: "blob" });
            const imageObjectUrl = URL.createObjectURL(response.data);
            setImageObjectUrl(imageObjectUrl)
        })()
    }, [disable, imageRequestRoute]);

    return [imageObjectUrl, setImageObjectUrl] as const
}

export default useGetProtectedImageUrl;