import { Box, Collapse, useDisclosure } from "@chakra-ui/react";
import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { cn } from "src/utils/component";
import BaseSidebarListItem from ".";
import { BaseSidebarListItemProps } from "./BaseSidebarListItem";

type _SidebarListItemProps = {
	title: string;
	icon?: IconProp;
} & (
	| {
			children?: React.ReactNode;
			urlPath?: never;
			count?: never;
	  }
	| {
			children?: never;
			urlPath?: string;
			count?: number;
	  }
);
export type SidebarListItemProps = PropsWithChildren<_SidebarListItemProps> &
	Omit<BaseSidebarListItemProps, keyof _SidebarListItemProps | "children">;

function SidebarListItem({
	className,
	count,
	variant = "horizontal",
	title,
	children,
	...props
}: SidebarListItemProps) {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<>
			<BaseSidebarListItem onClick={() => !!children && onToggle()} {...props}>
				{(isActive) => (
					<Box
						className={classNames("flex items-center justify-center rounded-xl", {
							"flex-col gap-2": variant === "vertical",
						})}
					>
						{props.icon && (
							<>
								<FontAwesomeIcon
									icon={props.icon}
									size={(variant === "vertical" ? "lg" : "1x") as SizeProp}
									className="aspect-square"
								/>
							</>
						)}

						<Box
							as="h3"
							className={classNames(``, {
								"font-bold": isActive,
								"ml-6 mr-auto": variant === "horizontal",
								"text-xs": variant === "vertical",
							})}
						>
							{title}
						</Box>

						{count && variant === "horizontal" && (
							<>
								<div className="text-secondary text-sm">{count}</div>
							</>
						)}

						{!!children && (
							<>
								<FontAwesomeIcon
									className={cn("transition-all", {
										"rotate-180": isOpen,
									})}
									icon={faCaretUp}
								/>
							</>
						)}
					</Box>
				)}
			</BaseSidebarListItem>
			<Collapse in={isOpen}>
				<ul className="flex flex-col gap-4 pl-4">{children}</ul>
			</Collapse>
		</>
	);
}

export default SidebarListItem;
