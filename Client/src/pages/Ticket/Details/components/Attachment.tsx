import { Flex } from "@chakra-ui/react";

type AttachmentProps = {
    attachment: any
}

function Attachment({ attachment }: AttachmentProps) {
    return (
        <Flex className="rounded-md p-2 bg-white dark:bg-gray-500 flex-1">
            {attachment.originalFileName}
        </Flex>
    );
}

export default Attachment;