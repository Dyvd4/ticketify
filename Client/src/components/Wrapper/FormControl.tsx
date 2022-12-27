import { FormControl as ChakraFormControl, FormControlProps as ChakraFormControlProps, FormErrorMessage } from "@chakra-ui/react";

type FormControlProps = {
    errorMessage?: string
} & ChakraFormControlProps

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