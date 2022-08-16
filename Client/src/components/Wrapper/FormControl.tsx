import { FormControl as ChakraFormControl, FormErrorMessage } from "@chakra-ui/react";

type FormControlProps = {
    children: React.ReactNode
    errorMessage?: string
}

function FormControl({ errorMessage, children }: FormControlProps) {
    return (
        <ChakraFormControl isInvalid={!!errorMessage}>
            {children}
            <FormErrorMessage>
                {errorMessage}
            </FormErrorMessage>
        </ChakraFormControl>
    );
}

export default FormControl;