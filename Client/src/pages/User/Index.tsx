import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _UserIndexProps = {};

export type UserIndexProps = _UserIndexProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _UserIndexProps>;

function UserIndex({ className, ...props }: UserIndexProps) {
	return (
		<div className={cn("", className)} {...props}>
			My component
		</div>
	);
}

export default UserIndex;
