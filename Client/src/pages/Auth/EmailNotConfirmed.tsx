import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Divider,
	Input,
	useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { Navigate } from "react-router-dom";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import FormControl from "src/components/Wrapper/FormControl";
import { useCurrentUser } from "src/hooks/user";
import { request } from "src/services/request";
import {
	getValidationErrorMap,
	ValidationErrorMap,
	ValidationErrorResponse,
} from "src/utils/error";
import { isAuthenticated } from "../../auth/auth";
import MutationErrorAlert from "../../components/ErrorAlert";

interface EmailNotConfirmedIndexProps {}

function EmailNotConfirmedIndex(props: EmailNotConfirmedIndexProps) {
	const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
	const [email, setEmail] = useState<any>("");

	const toast = useToast();

	const confirmEmailMutation = useMutation(
		() => {
			return request().post("auth/confirmEmail");
		},
		{
			onSuccess: () => {
				toast({
					status: "success",
					title: "Successfully sent e-mail",
				});
			},
		}
	);

	const updateEmailMutation = useMutation(
		async () => {
			const response = await request().put(`user/email`, {
				email: email || currentUser.email,
			});
			return response;
		},
		{
			onSuccess: async () => {
				await refetch();
				setErrorMap(null);
				toast({
					status: "success",
					title: "Successfully changed e-mail",
				});
			},
			onError: (error: AxiosError<ValidationErrorResponse>) => {
				const errorMap = getValidationErrorMap(error, "email");
				setErrorMap(errorMap);
			},
		}
	);

	const { currentUser, isLoading, refetch } = useCurrentUser();

	if (isLoading) return <LoadingRipple centered />;

	if (isAuthenticated(currentUser)) return <Navigate to="/Auth/EmailConfirmed" />;

	return (
		<>
			<Box className="mt-10 flex justify-center gap-4">
				<h1 className="flex items-center text-6xl">401</h1>
				<div className="text-black">
					<Divider orientation="vertical" />
				</div>
				<Box>
					<h3 className="text-3xl">Your e-mail has not been confirmed</h3>
					<Box className="px-2">
						<p className="mt-2">
							We sent you a verification link <b>({currentUser.email})</b>.
						</p>
						<p className="mt-2">
							<b>Click on it</b> in order to get access to ticketify.
						</p>
					</Box>
				</Box>
			</Box>
			<h3 className="mt-4 text-2xl">Bad cases</h3>
			<Accordion className="mt-4" allowMultiple>
				<AccordionItem>
					<h2>
						<AccordionButton className="flex justify-between font-bold">
							I didn't get an e-mail
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel className="leading-relaxed">
						<div>We got you 🙂</div>
						<div>
							In case you didn't get an e-mail, <b>press the resend-button</b> and we
							will send you an e-mail again.
						</div>
						<Button
							className="mt-2 mb-4"
							isLoading={confirmEmailMutation.isLoading}
							onClick={() => confirmEmailMutation.mutate()}
						>
							Resend
						</Button>
						{confirmEmailMutation.isError && (
							<>
								<MutationErrorAlert />
							</>
						)}
					</AccordionPanel>
				</AccordionItem>

				<AccordionItem>
					<h2>
						<AccordionButton className="flex justify-between font-bold">
							I provided the wrong e-mail
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel className="leading-relaxed">
						<div>
							If you provided the wrong e-mail, we give you the opportunity to change
							it.
						</div>
						<FormControl className="mt-2" errorMessage={errorMap?.message}>
							<FormControl errorMessage={errorMap?.email}>
								<Input
									type="email"
									name="email"
									value={email || currentUser.email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</FormControl>
						</FormControl>
						<Button
							className="my-4"
							isLoading={updateEmailMutation.isLoading}
							onClick={() => updateEmailMutation.mutate()}
						>
							Save
						</Button>
						{updateEmailMutation.isError && !errorMap && (
							<>
								<MutationErrorAlert />
							</>
						)}
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</>
	);
}

export default EmailNotConfirmedIndex;
