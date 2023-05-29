import { Tooltip, TooltipProps } from "@chakra-ui/react";
import { faAdd, faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton, { IconButtonProps } from "../Wrapper/IconButton";

type TooltipIconButtonProps = {
	iconButtonProps?: Omit<IconButtonProps, "aria-label" | "icon">;
	tooltipProps?: Omit<TooltipProps, "children">;
	variant: keyof typeof VARIANT_MAP;
};

export const VARIANT_MAP = {
	add: {
		icon: faAdd,
		colorScheme: "blue",
	},
	edit: {
		icon: faEdit,
		colorScheme: "gray",
	},
	remove: {
		icon: faRemove,
		colorScheme: "gray",
	},
};

function TooltipIconButton({
	variant,
	iconButtonProps,
	tooltipProps,
	...props
}: TooltipIconButtonProps) {
	return (
		<>
			<Tooltip label={variant} placement="top" {...tooltipProps}>
				<IconButton
					colorScheme={VARIANT_MAP[variant].colorScheme}
					size={"sm"}
					aria-label={variant}
					icon={<FontAwesomeIcon icon={VARIANT_MAP[variant].icon} />}
					{...iconButtonProps}
				/>
			</Tooltip>
		</>
	);
}

export default TooltipIconButton;
