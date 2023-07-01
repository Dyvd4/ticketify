import { Box, Collapse, Tooltip } from "@chakra-ui/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useAtom } from "jotai";
import { PropsWithChildren, useId } from "react";
import { sidebarIsCollapsedAtom } from "src/context/atoms";
import useLocalStorage from "src/hooks/useLocalStorage";
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
	const id = useId();
	const [isOpen, setIsOpen] = useLocalStorage(`SidebarListItem-${id}`, false);
	const allowExpand = isOpen && variant === "horizontal";
	const [sidebarIsCollapsed, setSidebarIsCollapsed] = useAtom(sidebarIsCollapsedAtom);

	const handleClick = () => {
		if (!children) return;
		setIsOpen(variant === "vertical" || !isOpen);
		sidebarIsCollapsed && setSidebarIsCollapsed(false);
	};

	return (
		<>
			<BaseSidebarListItem onClick={handleClick} {...props}>
				{(isActive) => (
					<Box
						className={classNames("flex items-center justify-center rounded-xl", {
							"flex-col gap-2": variant === "vertical",
						})}
					>
						{props.icon && variant === "vertical" && (
							<Tooltip label={title} placement="right">
								<div className="flex flex-col items-center gap-2">
									<FontAwesomeIcon
										icon={props.icon}
										size={"lg"}
										className="aspect-square"
									/>
									{!!count && (
										<div className="text-secondary text-xs">{count}</div>
									)}
								</div>
							</Tooltip>
						)}
						{variant === "horizontal" && (
							<>
								{props.icon && (
									<FontAwesomeIcon
										icon={props.icon}
										size={"1x"}
										className="aspect-square"
									/>
								)}

								<Box
									as="h3"
									className={classNames(`ml-6 mr-auto`, {
										"font-bold": isActive,
									})}
								>
									{title}
								</Box>

								{!!count && <div className="text-secondary text-sm">{count}</div>}

								{!!children && (
									<FontAwesomeIcon
										className={cn("transition-all", {
											"rotate-180": isOpen,
										})}
										icon={faCaretUp}
									/>
								)}
							</>
						)}
					</Box>
				)}
			</BaseSidebarListItem>
			<Collapse in={allowExpand}>
				<ul className="flex flex-col gap-4 pl-4">{children}</ul>
			</Collapse>
		</>
	);
}

export default SidebarListItem;
