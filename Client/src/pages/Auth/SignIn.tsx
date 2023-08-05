import { Button, FormLabel, Heading, Input, Link, VStack } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import { portalIsRenderedAtom } from "src/context/atoms";
import { signIn } from "../../auth/auth";
import Card from "../../components/Card";
import {
	getValidationErrorMap,
	ValidationErrorMap,
	ValidationErrorResponse,
} from "../../utils/error";

function SignIn() {
	const { prevRoute } = window.history.state.usr ?? {};
	const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [portalIsRendered] = useAtom(portalIsRenderedAtom);

	const mutation = useMutation(
		() => {
			return signIn(usernameRef.current!.value, passwordRef.current!.value);
		},
		{
			onSuccess: () => {
				window.location.href = prevRoute || "/";
			},
			onError: (error: AxiosError<ValidationErrorResponse>) => {
				const errorMap = getValidationErrorMap(error);
				setErrorMap(errorMap);
			},
		}
	);

	return portalIsRendered
		? ReactDOM.createPortal(
				<Card className="w-3/4 sm:w-auto" centered>
					<Heading as="h1" className="mb-2">
						Sign in
					</Heading>
					<VStack>
						<FormControl errorMessage={errorMap?.message}>
							<FormControl errorMessage={errorMap?.username}>
								<FormLabel>Username</FormLabel>
								<Input size="sm" ref={usernameRef} name="username" />
							</FormControl>
							<FormControl errorMessage={errorMap?.password}>
								<FormLabel>Password</FormLabel>
								<Input
									type="password"
									size="sm"
									ref={passwordRef}
									name="password"
								/>
							</FormControl>
						</FormControl>
						<Button
							size="sm"
							className="mt-4"
							onClick={() => mutation.mutate()}
							colorScheme="blue"
						>
							Submit
						</Button>
						<Link href="/Auth/SignUp">Sign up</Link>
					</VStack>
				</Card>,
				document.getElementById("portal")!
		  )
		: null;
}

export default SignIn;
