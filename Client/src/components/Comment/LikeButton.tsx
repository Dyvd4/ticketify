import { Tooltip } from "@chakra-ui/react";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import {
	faThumbsDown as farThumbsDown,
	faThumbsUp as farThumbsUp,
} from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef } from "react";

export type LikeButtonVariant = "like" | "dislike";

type LikeButtonProps = {
	variant: LikeButtonVariant;
	active?: boolean;
} & ComponentPropsWithRef<"div">;

function LikeButton({ variant, active, onClick, ...props }: LikeButtonProps) {
	return (
		<Tooltip label={variant} placement="bottom" {...props}>
			<span onClick={onClick} className="cursor-pointer">
				<FontAwesomeIcon
					icon={
						variant === "like"
							? !!active
								? faThumbsUp
								: farThumbsUp
							: !!active
							? faThumbsDown
							: farThumbsDown
					}
				/>
			</span>
		</Tooltip>
	);
}

export default LikeButton;
