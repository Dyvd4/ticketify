import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

type ErrorAlertProps = {};

function ErrorAlert(props: ErrorAlertProps) {
	return (
		<Alert
			className="rounded-md py-8"
			status="error"
			variant="subtle"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			textAlign="center"
		>
			<AlertIcon boxSize="40px" mr={0} />
			<AlertTitle className="mt-4 text-xl">An unknown error ocurred</AlertTitle>
			<AlertDescription maxWidth="sm" className="mt-4 text-sm">
				We're sorry but it seems that an error occurred during your request. Please write an
				e-mail to our support <b>({SUPPORT_EMAIL})</b>. We will take care of the problem!
			</AlertDescription>
		</Alert>
	);
}

export default ErrorAlert;
