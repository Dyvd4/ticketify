import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _DetailsPageHeadProps = {};

export type DetailsPageHeadProps = _DetailsPageHeadProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _DetailsPageHeadProps>;

function DetailsPageHead({ className, children, ...props }: DetailsPageHeadProps) {
	return (
		<div className={cn("flex flex-col items-center gap-4", className)} {...props}>
			{children}
		</div>
	);
}

export default DetailsPageHead;
