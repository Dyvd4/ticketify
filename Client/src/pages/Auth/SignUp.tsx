import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { signUp } from "../../auth/auth";
import Card from "../../components/Card";
import { getValidationError } from "../../utils/error";

function SignUp() {

    const [errorMessage, setErrorMessage] = useState<string>();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        const response = await signUp(usernameRef.current!.value, passwordRef.current!.value);
        if (response.status === 200) return window.location.href = "/";
        const errorMessage = getValidationError({ response });
        setErrorMessage(errorMessage);
    }

    return (
        <Card className="w-3/4 sm:w-auto" centered>
            <Heading as="h1" className="mb-2">
                Sign up
            </Heading>
            <VStack>
                <FormControl isInvalid={!!errorMessage}>
                    <FormControl>
                        <FormLabel>
                            Username
                        </FormLabel>
                        <Input size="sm" ref={usernameRef} name="username" />
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            Password
                        </FormLabel>
                        <Input type="password" size="sm" ref={passwordRef} name="password" />
                    </FormControl>
                    {errorMessage && <>
                        <FormErrorMessage>
                            {errorMessage}
                        </FormErrorMessage>
                    </>}
                </FormControl>
                <Button
                    size="sm"
                    className="mt-4"
                    onClick={handleSubmit}
                    colorScheme="blue">
                    Submit
                </Button>
                <Link href="/Auth/SignIn">
                    Sign in
                </Link>
            </VStack>
        </Card>
    );
}

export default SignUp;