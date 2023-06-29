import { Heading } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _DetailsPageHeadTitleProps = {};

export type DetailsPageHeadTitleProps = _DetailsPageHeadTitleProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _DetailsPageHeadTitleProps>;

function DetailsPageHeadTitle({ className, children, ...props }: DetailsPageHeadTitleProps) {
	return (
		<Heading as="h1" className={cn("text-5xl", className)} {...props}>
			{children}
		</Heading>
	);
}

export default DetailsPageHeadTitle;
