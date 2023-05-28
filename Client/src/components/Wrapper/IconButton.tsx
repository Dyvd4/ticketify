import {
	IconButton as ChakraIconButton,
	IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export type IconButtonProps = {
	icon: React.ReactNode;
	circle?: boolean;
} & ChakraIconButtonProps;

const IconButton = forwardRef((props: IconButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
	const { icon, circle, className, ...rest } = props;

	return (
		<ChakraIconButton
			ref={ref}
			className={`transform transition-transform duration-100 active:scale-90
                        ${circle ? "rounded-full" : "rounded-lg"} 
                        ${className}`}
			icon={icon}
			{...rest}
		/>
	);
});

export default IconButton;
