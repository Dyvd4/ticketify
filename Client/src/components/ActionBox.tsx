import { Heading, IconButton, IconButtonProps, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cloneElement, ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _ActionBoxProps = {
	title?: string;
	actions?: React.ReactElement[];
	menuActions?: React.ReactElement[];
	menuButtonSize?: IconButtonProps["size"];
};

export type ActionBoxProps = _ActionBoxProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _ActionBoxProps>;

function ActionBox({
	className,
	title,
	children,
	actions,
	menuActions,
	menuButtonSize,
	...props
}: ActionBoxProps) {
	return (
		<div
			className={cn("relative justify-between gap-4 rounded-md border p-4", className)}
			{...props}
		>
			<div className="flex items-center justify-between gap-4">
				<Heading className="truncate text-xl">{title}</Heading>
				<div className="flex gap-2">
					{actions && (
						<>
							{actions.map((action, index) =>
								cloneElement(action, { ...action.props, key: index })
							)}
						</>
					)}
					{menuActions && (
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
			<div className="pt-4">{children}</div>
		</div>
	);
}

export default ActionBox;
