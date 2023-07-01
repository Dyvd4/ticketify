import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _LoadingRippleProps = {};

export type LoadingRippleProps = _LoadingRippleProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _LoadingRippleProps>;

function LoadingRipple({ className, ...props }: LoadingRippleProps) {
	return (
		<div
			data-testid="LoadingRipple"
			className={cn(
				`lds-ripple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform`,
				className
			)}
			{...props}
		>
			<div className="border-gray-800 dark:border-white"></div>
			<div className="border-gray-800 dark:border-white"></div>
		</div>
	);
}

export default LoadingRipple;
