import { BackgroundProps, Box } from "@chakra-ui/react";
import { ComponentPropsWithRef } from "react";

type CircleProps = {
	/** the size from tailwind's width or height sizes */
	size?: number;
	bgColor?: BackgroundProps["bgColor"];
} & Omit<ComponentPropsWithRef<"div">, "children">;

function Circle({ size = 4, bgColor = "green-500", className, ...props }: CircleProps) {
	return (
		<Box
			bgColor={bgColor}
			className={`rounded-full w-${size} h-${size} ${className}`}
			{...props}
		></Box>
	);
}

export default Circle;
