import {
	Divider,
	Heading,
	IconButton,
	IconButtonProps,
	Menu,
	MenuButton,
	MenuList,
	Tooltip,
} from "@chakra-ui/react";
import autoAnimate from "@formkit/auto-animate";
import { faMinusSquare, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cloneElement, ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _ActionBoxProps = {
	title?: React.ReactNode;
	actions?: React.ReactElement[];
	menuActions?: React.ReactElement[];
	menuButtonSize?: IconButtonProps["size"];
	useDivider?: boolean;
} & (
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

export type ActionBoxProps = _ActionBoxProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _ActionBoxProps>;

function ActionBox({
	className,
	title,
	children,
	actions,
	menuActions,
	menuButtonSize,
	useDivider,
	useCollapse,
	isCollapsed,
	toggleIsCollapsed,
	...props
}: ActionBoxProps) {
	return (
		<div
			ref={(ref) => ref && autoAnimate(ref)}
			className={cn("rounded-md border p-4", className)}
			{...props}
		>
			<div className="flex items-center justify-between gap-4">
				<div className="flex min-w-0 items-center gap-2">
					{useCollapse && (
						<>
							<Tooltip label={isCollapsed ? "expand" : "collapse"} placement="top">
								<IconButton
									backgroundColor={"transparent"}
									onClick={toggleIsCollapsed}
									size={"sm"}
									aria-label={"toggle collapse"}
									icon={
										<FontAwesomeIcon
											icon={isCollapsed ? faPlusSquare : faMinusSquare}
										/>
									}
								/>
							</Tooltip>
						</>
					)}
					<Heading className="truncate text-xl">{title}</Heading>
				</div>
				<div className="flex gap-2">
					{actions && (
						<>
							{actions.map((action, index) =>
								cloneElement(action, { ...action.props, key: index })
							)}
						</>
					)}
					{menuActions && menuActions.length > 0 && (
						<>
							<Menu>
								<MenuButton
									as={IconButton}
									size={menuButtonSize || "xs"}
									aria-label="Options"
									icon={<FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>}
									variant="outline"
								/>
								<MenuList>
									{menuActions.map((action, index) =>
										cloneElement(action, { ...action.props, key: index })
									)}
								</MenuList>
							</Menu>
						</>
					)}
				</div>
			</div>
			{!isCollapsed && (
				<>
					{useDivider && (
						<>
							<Divider className="mt-4" />
						</>
					)}
					<div className="pt-4">{children}</div>
				</>
			)}
		</div>
	);
}

export default ActionBox;
