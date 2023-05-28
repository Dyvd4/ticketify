import { Link } from "@chakra-ui/react";
import { ComponentPropsWithRef } from "react";

export type Variant = "vertical" | "horizontal";
export type _BaseSidebarListItemProps = {
	children(isActive: boolean): React.ReactNode;
	variant?: Variant;
	urlPath?: string;
};
export type BaseSidebarListItemProps = _BaseSidebarListItemProps &
	Omit<ComponentPropsWithRef<"a">, keyof _BaseSidebarListItemProps>;

function BaseSidebarListItem({
	className,
	children,
	variant = "horizontal",
	urlPath,
	...props
}: BaseSidebarListItemProps) {
	const isActive = window.location.pathname === urlPath;

	return (
		<Link
			href={urlPath}
			className={`${className}`}
			_hover={{
				color: "blue.100",
			}}
			_light={{
				_hover: {
					color: "blue.500",
				},
				...(isActive ? { color: "blue.600" } : {}),
			}}
			{...(isActive ? { color: "blue.200" } : {})}
			{...props}
		>
			{children(isActive)}
		</Link>
	);
}

export default BaseSidebarListItem;
