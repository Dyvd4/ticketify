import { Box, BoxProps } from "@chakra-ui/react";
import classNames from "classnames";
import { PropsWithChildren } from "react";

export type BgBoxProps = PropsWithChildren<{
    variant?: keyof typeof VARIANT_MAP,
    /** displays a slightly lighter color when hovering */
    enableHover?: boolean
    /** takes hover color as a permanent state */
    isActive?: boolean
    /** tailwind class for padding to override default */
    twPadding?: string
}> & BoxProps

export const VARIANT_MAP = {
    child: {
        _light: {
            backgroundColor: "gray.100"
        },
        backgroundColor: "gray.900",
        hover: {
            _light: {
                backgroundColor: "white"
            },
            backgroundColor: "gray.800",
        }
    },
    normal: {
        _light: {
            backgroundColor: "gray.300"
        },
        backgroundColor: "gray.700",
        hover: {
            _light: {
                backgroundColor: "gray.200"
            },
            backgroundColor: "gray.600",
        }
    }
}

function BgBox(props: BgBoxProps) {

    const {
        children,
        className,
        variant = "normal",
        enableHover,
        isActive,
        twPadding: padding,
        ...restProps
    } = props;

    const hoverBackgroundColorProps = enableHover || isActive
        ? {
            _hover: {
                _light: {
                    backgroundColor: VARIANT_MAP[variant].hover._light.backgroundColor
                },
                backgroundColor: VARIANT_MAP[variant].hover.backgroundColor
            }
        }
        : {}

    const backgroundColorProps = {
        _light: {
            backgroundColor: isActive
                ? VARIANT_MAP[variant].hover._light.backgroundColor
                : VARIANT_MAP[variant]._light.backgroundColor
        },
        backgroundColor: isActive
            ? VARIANT_MAP[variant].hover.backgroundColor
            : VARIANT_MAP[variant].backgroundColor
    }

    return (
        <Box
            {...backgroundColorProps}
            {...hoverBackgroundColorProps}
            className={classNames(`rounded-md ${className}`, {
                "cursor-pointer": enableHover,
                "p-4": !padding,
                [padding || ""]: !!padding
            })}
            {...restProps}>
            {children}
        </Box>
    );
}

export default BgBox;