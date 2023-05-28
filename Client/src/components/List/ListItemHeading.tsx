import { Heading } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";

type ListItemHeadingProps = PropsWithChildren<{}> & ComponentPropsWithRef<"h2">;

function ListItemHeading({ className, children, ...props }: ListItemHeadingProps) {
	return (
		<Heading className={`text-xl leading-none ${className}`} {...props}>
			{children}
		</Heading>
	);
}

export default ListItemHeading;
