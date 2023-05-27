import { Image } from "@chakra-ui/react";
import useGetProtectedImageUrl from "src/hooks/useGetProtectedImageUrl";

function ImageWrapper({ attachment }) {
    const [imageUrl] = useGetProtectedImageUrl(attachment.contentRoute);

    return (
        <Image
            className={`m-0 h-20 w-20 rounded-md`}
            objectFit="cover"
            alt={attachment.originalFileName}
            src={imageUrl}
        />
    );
}

export default ImageWrapper;
