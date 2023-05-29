import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _TestComponentProps = {} & (
	| {
			useCollapse: true;
			isCollapsed: boolean;
			toggleIsCollapsed(): void;
	  }
	| {
			useCollapse?: never;
			isCollapsed?: never;
			toggleIsCollapsed?: never;
	  }
);

export type TestComponentProps = _TestComponentProps;

function TestComponent({ ...props }: TestComponentProps) {
	return (
		<div className={cn("")} {...props}>
			My component
		</div>
	);
}

export default TestComponent;
