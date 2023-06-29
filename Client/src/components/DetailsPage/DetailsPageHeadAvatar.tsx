import { Avatar, AvatarProps } from "@chakra-ui/react";
import { cn } from "src/utils/component";

type _DetailsPageHeadAvatarProps = {};

export type DetailsPageHeadAvatarProps = _DetailsPageHeadAvatarProps & Omit<AvatarProps, "size">;

function DetailsPageHeadAvatar({ className, ...props }: DetailsPageHeadAvatarProps) {
	return <Avatar className={cn("", className)} size={"2xl"} {...props} />;
}

export default DetailsPageHeadAvatar;
