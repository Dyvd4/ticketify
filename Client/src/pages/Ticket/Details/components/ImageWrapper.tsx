import { Image } from "@chakra-ui/react";
import useGetProtectedImageUrl from "src/hooks/useProtectedImage";

function ImageWrapper({ attachment }) {

    const [imageUrl] = useGetProtectedImageUrl(attachment.contentRoute)

    return (
        <Image
            className={`w-20 h-20 rounded-md m-0`}
            objectFit="cover"
            alt={attachment.originalFileName}
            src={imageUrl}
        />
    );
}

export default ImageWrapper;