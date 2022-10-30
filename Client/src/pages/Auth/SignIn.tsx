import { Button, FormLabel, Heading, Input, Link, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import { signIn } from "../../auth/auth";
import Card from "../../components/Card";
import { getValidationErrorMap, ValidationErrorMap } from "../../utils/error";

function SignIn() {
    const { prevRoute } = window.history.state.usr ?? {};
    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation(() => {
        return signIn(usernameRef.current!.value, passwordRef.current!.value)
    }, {
        onSuccess: () => {
            window.location.href = prevRoute || "/";
        },
        onError: (error) => {
            const errorMap = getValidationErrorMap(error);
            setErrorMap(errorMap);
        }
    });

    return (
        <Card className="w-3/4 sm:w-auto" centered>
            <Heading as="h1" className="mb-2">
                Sign in
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
                    onClick={() => mutation.mutate()}
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