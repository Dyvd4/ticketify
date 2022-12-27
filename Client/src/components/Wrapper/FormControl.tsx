import { FormControl as ChakraFormControl, FormControlProps as ChakraFormControlProps, FormErrorMessage } from "@chakra-ui/react";
import { ComponentPropsWithRef } from "react";

type FormControlProps = {
    errorMessage?: string
} & ChakraFormControlProps
    // only picked specific props from ComponentPropsWithRef
    // bc ChakraFormControlProps is already there and should provide all the other html props
    & Pick<ComponentPropsWithRef<"div">, "ref">

function FormControl({ errorMessage, children, ...props }: FormControlProps) {
    return (
        <ChakraFormControl isInvalid={!!errorMessage} {...props}>
            {children}
            <FormErrorMessage>
                {errorMessage}
            </FormErrorMessage>
        </ChakraFormControl>
    );
}

export default FormControl;