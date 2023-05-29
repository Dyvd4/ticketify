import { Box, Flex, Image } from "@chakra-ui/react";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "src/utils/component";
import Attachment from "./Attachment";

type AttachmentsProps = {
	attachments: any[];
	variant: "images" | "files" | "all";
};

function Attachments({ attachments, variant }: AttachmentsProps) {
	return attachments.length > 0 ? (
		<Box
			className={cn("mt-2", {
				"flex flex-wrap": variant === "images",
				"grid grid-cols-2": variant !== "images",
			})}
			gap={2}
		>
			{attachments.map((attachment) => {
				return variant === "images" ? (
					<Zoom key={attachment.id}>
						<Image
							className={`m-0 h-12 w-12 rounded-md`}
							objectFit="cover"
							alt={attachment.originalFileName}
							src={attachment.url}
						/>
					</Zoom>
				) : (
					<Attachment key={attachment.id} file={attachment} />
				);
			})}
		</Box>
	) : (
		<Flex gap={2} alignItems={"center"} className="text-secondary mt-2 text-sm">
			No {variant === "all" ? "attachments" : variant}
			😴
		</Flex>
	);
}

export default Attachments;
