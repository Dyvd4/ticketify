import { Alert } from "@chakra-ui/react";

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

type ErrorAlertProps = {};

function ErrorAlert(props: ErrorAlertProps) {
    return (
        <Alert status="error" className="flex-col items-start rounded-md">
            <div>We're sorry but it seems that an error occurred during your request.</div>
            <div>
                Please write an e-mail to our support <b>({SUPPORT_EMAIL})</b>.
            </div>
            <div>We will take care of the problem!</div>
        </Alert>
    );
}

export default ErrorAlert;
