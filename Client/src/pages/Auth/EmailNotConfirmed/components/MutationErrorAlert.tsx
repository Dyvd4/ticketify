import { Alert } from "@chakra-ui/react";

const SUPPORT_EMAIL = process.env.REACT_APP_SUPPORT_EMAIL;

type MutationErrorAlertProps = {}

function MutationErrorAlert(props: MutationErrorAlertProps) {
    return (
        <Alert status="error" className="flex-col items-start rounded-md">
            <div>
                We're sorry but it seems that an error occurred during your request.
            </div>
            <div>
                Please write an e-mail to our support <b>({SUPPORT_EMAIL})</b>.
            </div>
            <div>
                We will take care of the problem!
            </div>
        </Alert>
    );
}

export default MutationErrorAlert;