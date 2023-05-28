import { Flex, HStack, Image } from "@chakra-ui/react";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Attachment from "./Attachment";

type AttachmentsProps = {
	attachments: any[];
	variant: "images" | "files" | "all";
};

function Attachments({ attachments, variant }: AttachmentsProps) {
	return attachments.length > 0 ? (
		<HStack className="flex-wrap py-2" gap={4}>
			{attachments.map((attachment) => {
				return variant === "images" ? (
					<Zoom key={attachment.id}>
						<Image
							className={`m-0 h-20 w-20 rounded-md`}
							objectFit="cover"
							alt={attachment.originalFileName}
							src={attachment.url}
						/>
					</Zoom>
				) : (
					<Attachment key={attachment.id} file={attachment} />
				);
			})}
		</HStack>
	) : (
		<Flex gap={2} alignItems={"center"}>
			No {variant === "all" ? "attachments" : variant}
			<FontAwesomeIcon icon={faFrown} />
		</Flex>
	);
}

export default Attachments;
