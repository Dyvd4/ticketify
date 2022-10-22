import { Alert, Box, ModalBody as ChakraModalBody } from "@chakra-ui/react";
import { ComponentPropsWithRef } from "react";
import LoadingRipple from "../Loading/LoadingRipple";

type ModalBodyProps = {
    isLoading?: boolean
    isError?: boolean
} & ComponentPropsWithRef<"div">

function ModalBody({ children, isLoading, isError, ...props }: ModalBodyProps) {
    return (
        <ChakraModalBody {...props}>
            {!!isLoading && !isError && <>
                <Box style={{ minHeight: "40vh" }} className="relative">
                    <LoadingRipple centered />
                </Box>
            </>}
            {!!isError && <>
                <Alert status="error">
                    An unkown error occurred
                </Alert>
            </>}
            {!isLoading && !isError && <>
                {children}
            </>}
        </ChakraModalBody>
    );
}

export default ModalBody;