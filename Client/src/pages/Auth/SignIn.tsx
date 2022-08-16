import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { signIn } from "../../auth/auth";
import Card from "../../components/Card";
import { getValidationErrorMap } from "../../utils/error";

function SignIn() {
    const { prevRoute } = window.history.state.usr ?? {};
    const [errorMap, setErrorMap] = useState<{ [key: string]: string }>();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        const response = await signIn(usernameRef.current!.value, passwordRef.current!.value);
        if (response.status === 200) return window.location.href = prevRoute || "/";
        const errorMap = getValidationErrorMap({ response });
        setErrorMap(errorMap);
    }
    return (
        <Card className="w-3/4 sm:w-auto" centered>
            <Heading as="h1" className="mb-2">
                Sign in
            </Heading>
            <VStack>
                <FormControl isInvalid={!!errorMap?.Fieldless}>
                    <FormControl isInvalid={!!errorMap?.username}>
                        <FormLabel>
                            Username
                        </FormLabel>
                        <Input size="sm" ref={usernameRef} name="username" />
                        <FormErrorMessage>
                            {errorMap?.username}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errorMap?.password}>
                        <FormLabel>
                            Password
                        </FormLabel>
                        <Input type="password" size="sm" ref={passwordRef} name="password" />
                        <FormErrorMessage>
                            {errorMap?.password}
                        </FormErrorMessage>

                    </FormControl>
                    <FormErrorMessage>
                        {errorMap?.Fieldless}
                    </FormErrorMessage>
                </FormControl>
                <Button
                    size="sm"
                    className="mt-4"
                    onClick={handleSubmit}
                    colorScheme="blue">
                    Submit
                </Button>
                <Link href="/Auth/SignUp">
                    Sign up
                </Link>
            </VStack>
        </Card>
    );
}

export default SignIn;