import { Button, FormLabel, Heading, Input, Link, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import FormControl from "src/components/Wrapper/FormControl";
import { signUp } from "../../auth/auth";
import Card from "../../components/Card";
import { getValidationErrorMap, ValidationErrorMap } from "../../utils/error";

function SignUp() {

    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        const response = await signUp(usernameRef.current!.value, passwordRef.current!.value);
        if (response.status === 200) return window.location.href = "/";
        const errorMap = getValidationErrorMap({ response });
        setErrorMap(errorMap);
    }

    return (
        <Card className="w-3/4 sm:w-auto" centered>
            <Heading as="h1" className="mb-2">
                Sign up
            </Heading>
            <VStack>
                <FormControl errorMessage={errorMap?.Fieldless}>
                    <FormControl errorMessage={errorMap?.username}>
                        <FormLabel>
                            Username
                        </FormLabel>
                        <Input size="sm" ref={usernameRef} name="username" />
                    </FormControl>
                    <FormControl errorMessage={errorMap?.password}>
                        <FormLabel>
                            Password
                        </FormLabel>
                        <Input type="password" size="sm" ref={passwordRef} name="password" />
                    </FormControl>
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