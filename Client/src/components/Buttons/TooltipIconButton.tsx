import { Tooltip } from "@chakra-ui/react";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton, { IconButtonProps } from "../Wrapper/IconButton";

type TooltipIconButtonProps = {
    // named it "iconVariant" to differ it from "variant"-prop by chakra's IconButton
    iconVariant: keyof typeof VARIANT_MAP
} & Omit<IconButtonProps, "aria-label" | "icon">

export const VARIANT_MAP = {
    add: {
        icon: faAdd,
        colorScheme: "cyan"
    },
    edit: {
        icon: faEdit,
        colorScheme: "gray"
    },
    remove: {
        icon: faRemove,
        colorScheme: "gray"
    }
}

function TooltipIconButton({ iconVariant, ...props }: TooltipIconButtonProps) {
    return (
        <>
            <Tooltip
                label={iconVariant}
                placement="top">
                <IconButton
                    colorScheme={VARIANT_MAP[iconVariant].colorScheme}
                    size={"sm"}
                    aria-label={iconVariant}
                    icon={<FontAwesomeIcon icon={VARIANT_MAP[iconVariant].icon} />}
                    {...props}
                />
            </Tooltip>
        </>
    );
}

export default TooltipIconButton;