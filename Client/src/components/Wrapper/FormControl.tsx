import {
	FormControl as ChakraFormControl,
	FormControlProps as ChakraFormControlProps,
	FormErrorMessage,
} from "@chakra-ui/react";

type FormControlProps = {
	errorMessage?: string | string[];
} & ChakraFormControlProps;

function FormControl({ errorMessage, children, ...props }: FormControlProps) {
	return (
		<ChakraFormControl isInvalid={!!errorMessage} {...props}>
			{children}
			{errorMessage instanceof String && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
			{errorMessage instanceof Array && (
				<FormErrorMessage className="flex flex-col items-start gap-1">
					{errorMessage.map((message, i) => (
						<div key={i}>{message}</div>
					))}
				</FormErrorMessage>
			)}
		</ChakraFormControl>
	);
}

export default FormControl;
