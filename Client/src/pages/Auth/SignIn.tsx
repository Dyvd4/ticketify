import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../../auth/auth";
import Button from "../../components/Buttons/Default";
import Card from "../../components/Card";
import InputGroup from "../../components/InputGroup";
import Form from "../../components/Validation/Form";
import Item from "../../components/Validation/Item";
import Validation from "../../components/Validation/Validation";
import { getValidationError } from "../../utils/error";

function SignIn() {
    const { prevRoute } = window.history.state.usr ?? {};
    const [errorMessage, setErrorMessage] = useState<string>();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (hasErrors: boolean) => {
        if (!hasErrors) {
            const response = await signIn(usernameRef.current!.value, passwordRef.current!.value);
            if (response.status === 200) return window.location.href = prevRoute || "/";
            const errorMessage = getValidationError({ response });
            setErrorMessage(errorMessage);
        }
    }

    return (
        <Card centered>
            <h1>Sign in</h1>
            <Validation onSubmit={handleSubmit}>
                <Form id="SignIn">
                    <Item config={{
                        isRequired: {},
                        name: "username"
                    }}>
                        <InputGroup>
                            <label htmlFor="username">Username:</label>
                            <input ref={usernameRef} type="text" name="username" />
                        </InputGroup>
                    </Item>
                    <Item config={{
                        isRequired: {},
                        name: "password"
                    }}>
                        <InputGroup>
                            <label htmlFor="password">Password:</label>
                            <input ref={passwordRef} type="password" name="password" />
                        </InputGroup>
                    </Item>
                    {errorMessage && <>
                        <div className="text-red-500 mb-4">{errorMessage}</div>
                    </>}
                    <Button className="block mb-2" type="submit">Submit</Button>
                    <Link to="/Auth/SignUp">Sign up</Link>
                </Form>
            </Validation>
        </Card>
    );
}

export default SignIn;