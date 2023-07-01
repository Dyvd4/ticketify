import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import { request } from "src/services/request";
import {
	getValidationErrorMap,
	ValidationErrorMap,
	ValidationErrorResponse,
} from "src/utils/error";

type UsernameEditModalProps = {
	user: any;
	isOpen: boolean;
	onClose(...args: any): void;
	onSuccess?(...args: any[]): void;
};

function UsernameEditModal({ user, isOpen, ...props }: UsernameEditModalProps) {
	const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
	const [email, setEmail] = useState<any>(user.email);

	const mutation = useMutation(
		async () => {
			const response = await request().put(`user/email`, {
				email,
			});
			return response;
		},
		{
			onSuccess: (response) => {
				if (props.onSuccess) props.onSuccess();
				handleClose(response);
			},
			onError: (error: AxiosError<ValidationErrorResponse>) => {
				const errorMap = getValidationErrorMap(error, "email");
				setErrorMap(errorMap);
			},
		}
	);

	const handleClose = (response?) => {
		setEmail(response?.data?.email || user.email);
		setErrorMap(null);
		props.onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit email</ModalHeader>
				<ModalBody>
					<FormControl errorMessage={errorMap?.message}>
						<FormControl errorMessage={errorMap?.email}>
							<Input
								name="email"
								type={"email"}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>
					</FormControl>
					<Alert status="warning" className="mt-4 rounded-md">
						<AlertIcon />
						<Box>
							<AlertTitle>
								Changing your e-mail makes you unauthenticated again.
							</AlertTitle>
							<AlertDescription>
								After your e-mail has changed, we will send you an e-mail
								confirmation link to your new e-mail to make sure it exists.
							</AlertDescription>
						</Box>
					</Alert>
				</ModalBody>
				<ModalFooter>
					<Button
						isLoading={mutation.isLoading}
						mr={3}
						colorScheme={"blue"}
						onClick={() => mutation.mutate()}
					>
						Save
					</Button>
					<Button onClick={handleClose}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default UsernameEditModal;
