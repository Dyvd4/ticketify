import { Box } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";

type BgBoxProps = PropsWithChildren<{
    variant?: "normal" | "child"
}> & ComponentPropsWithRef<"div">

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
                backgroundColor: variant !== "child" ? "gray.200" : "white"
            }}
            backgroundColor={variant !== "child" ? "gray.700" : "gray.900"}
            className={`p-4 rounded-md ${className}`}
            {...restProps}>
            {children}
        </Box>
    );
}

export default BgBox;