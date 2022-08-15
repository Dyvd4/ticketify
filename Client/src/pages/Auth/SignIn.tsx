import { Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { signIn } from "../../auth/auth";
import Card from "../../components/Card";
import { getValidationError } from "../../utils/error";

function SignIn() {
    const { prevRoute } = window.history.state.usr ?? {};
    const [errorMessage, setErrorMessage] = useState<string>();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        const response = await signIn(usernameRef.current!.value, passwordRef.current!.value);
        if (response.status === 200) return window.location.href = prevRoute || "/";
        const errorMessage = getValidationError({ response });
        setErrorMessage(errorMessage);
    }
    // @ts-ignore
    let x = y.x
    return (
        <Card className="w-3/4 sm:w-auto" centered>
            <Heading as="h1" className="mb-2">
                Sign in
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
                </FormControl>
                {errorMessage && <>
                    <Text size="sm" className="text-red-500 mb-4">
                        {errorMessage}
                    </Text>
                </>}
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