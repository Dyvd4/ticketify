import { Box } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";

type BgBoxProps = PropsWithChildren<{
    variant?: keyof typeof VARIANT_MAP
}> & ComponentPropsWithRef<"div">

export const VARIANT_MAP = {
    child: {
        _light: {
            backgroundColor: "white"
        },
        backgroundColor: "gray.900"
    },
    normal: {
        _light: {
            backgroundColor: "gray.200"
        },
        backgroundColor: "gray.700"
    }
}

function BgBox(props: BgBoxProps) {

    const {
        children,
        className,
        variant = "normal",
        ...restProps
    } = props;

    return (
        <Box
            _light={{
                backgroundColor: VARIANT_MAP[variant]._light.backgroundColor
            }}
            backgroundColor={VARIANT_MAP[variant].backgroundColor}
            className={`p-4 rounded-md ${className}`}
            {...restProps}>
            {children}
        </Box>
    );
}

export default BgBox;