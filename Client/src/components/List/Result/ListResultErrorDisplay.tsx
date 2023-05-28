import { Alert, AlertIcon, Text } from "@chakra-ui/react";

function ListResultErrorDisplay() {
	return (
		<Alert className="rounded-md" status="error" variant="top-accent">
			<AlertIcon />
			<Text>There was an error processing your request</Text>
		</Alert>
	);
}

export default ListResultErrorDisplay;
