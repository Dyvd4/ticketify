import { Button, FormLabel, Heading, Input, Link, VStack } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import { portalIsRenderedAtom } from "src/context/atoms";
import { signUp } from "../../auth/auth";
import Card from "../../components/Card";
import {
	getValidationErrorMap,
	ValidationErrorMap,
	ValidationErrorResponse,
} from "../../utils/error";

function SignUp() {
	const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
	const usernameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [portalIsRendered] = useAtom(portalIsRenderedAtom);

	const mutation = useMutation(
		() => {
			return signUp(
				usernameRef.current!.value,
				emailRef.current!.value,
				passwordRef.current!.value
			);
		},
		{
			onSuccess: () => {
				window.location.href = "/";
			},
			onError: (error: AxiosError<ValidationErrorResponse>) => {
				const errorMap = getValidationErrorMap(error);
				setErrorMap(errorMap);
			},
		}
	);

	return (
				<Card className="w-3/4 sm:w-auto" centered>
					<Heading as="h1" className="mb-2">
						Sign up
					</Heading>
					<VStack>
						<FormControl errorMessage={errorMap?.message}>
							<FormControl errorMessage={errorMap?.username}>
								<FormLabel>Username</FormLabel>
								<Input size="sm" ref={usernameRef} name="username" />
							</FormControl>
							<FormControl errorMessage={errorMap?.email}>
								<FormLabel>E-mail</FormLabel>
								<Input size="sm" ref={emailRef} name="email" />
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
						<Link href="/Auth/SignIn">Sign in</Link>
					</VStack>
				</Card>
		  )
		
}

export default SignUp;
