import { Flex, HStack, Image } from "@chakra-ui/react";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import File from "./File";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

type AttachmentsProps = {
    attachments: any[]
    variant: "images" | "files"
}

function Attachments({ attachments, variant }: AttachmentsProps) {
    return (
        attachments.length > 0
            ? <HStack
                className="py-2 flex-wrap"
                gap={4}>
                {attachments.map(attachment => {
                    return variant === "images"
                        ? <Zoom key={attachment.id}>
                            <Image
                                className={`w-40 h-40 rounded-md m-0`}
                                objectFit="cover"
                                alt={attachment.originalFileName}
                                src={`data:${attachment.mimeType};base64,${attachment.content}`}
                            />
                        </Zoom>
                        : <File key={attachment.id} file={attachment} />
                })}
            </HStack>
            : <Flex
                gap={2}
                justifyContent={"center"}
                alignItems={"center"}>
                No {variant}
                <FontAwesomeIcon icon={faFrown} />
            </Flex>
    );
}

export default Attachments;