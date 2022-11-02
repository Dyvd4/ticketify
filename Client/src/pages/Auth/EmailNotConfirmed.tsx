import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, Box, Button, Container, Divider, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { Navigate } from "react-router-dom";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import FormControl from "src/components/Wrapper/FormControl";
import { useCurrentUser } from "src/hooks/user";
import { request } from "src/services/request";
import { getValidationErrorMap, ValidationErrorMap } from "src/utils/error";
import { isAuthenticated } from "../../auth/auth";

const SUPPORT_EMAIL = process.env.REACT_APP_SUPPORT_EMAIL;

interface EmailNotConfirmedProps { }

function EmailNotConfirmed(props: EmailNotConfirmedProps) {

    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
    const [email, setEmail] = useState<any>("");

    const toast = useToast();

    const confirmEmailMutation = useMutation(() => {
        return request().post("auth/confirmEmail");
    }, {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Successfully sent e-mail"
            });
        }
    });

    const updateEmailMutation = useMutation(async () => {
        const response = await request().put(`user/email`, {
            email: email || currentUser.email
        });
        return response;
    }, {
        onSuccess: async () => {
            await refetch();
            setErrorMap(null);
            toast({
                status: "success",
                title: "Successfully changed e-mail"
            });
        },
        onError: (error) => {
            const errorMap = getValidationErrorMap(error);
            setErrorMap(errorMap);
        }
    });

    const { currentUser, isLoading, refetch } = useCurrentUser();

    if (isLoading) return <LoadingRipple centered />

    if (isAuthenticated(currentUser)) return <Navigate to="/Auth/EmailConfirmed" />

    return (
        <Container maxW={"container.lg"}>
            <Box className="mt-10 flex gap-4 justify-center">
                <h1 className="text-6xl flex items-center">
                    401
                </h1>
                <div className="text-black">
                    <Divider orientation="vertical" />
                </div>
                <Box>
                    <h3 className="text-3xl">
                        Your e-mail has not been confirmed yet
                    </h3>
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
            <h3 className="text-2xl mt-4">
                Bad cases
            </h3>
            <Accordion className="mt-4" allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton className="flex justify-between font-bold">
                            I didn't get an e-mail
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        <div>
                            We got you 🙂
                        </div>
                        <div>
                            In case you didn't get an e-mail, <b>press the resend-button</b> and we will send you an e-mail again.
                        </div>
                        <Button
                            className="mt-2"
                            isLoading={confirmEmailMutation.isLoading}
                            onClick={() => confirmEmailMutation.mutate()}>
                            Resend
                        </Button>
                        {confirmEmailMutation.isError && <>
                            <Alert status="error" className="mt-2 flex-col items-start rounded-md">
                                <div>
                                    We're sorry but it seems that an error occurred during your request.
                                </div>
                                <div>
                                    Please write an e-mail to our support <b>({SUPPORT_EMAIL})</b>.
                                </div>
                                <div>
                                    We will take care of the problem!
                                </div>
                            </Alert>
                        </>}
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton className="flex justify-between font-bold">
                            I provided the wrong e-mail
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        <div>
                            If you provided the wrong e-mail, we give you the opportunity to change it.
                        </div>
                        <FormControl errorMessage={errorMap?.Fieldless}>
                            <FormControl className="mt-2" errorMessage={errorMap?.email}>
                                <Input
                                    type="email"
                                    name="email"
                                    value={email || currentUser.email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                        </FormControl>
                        <Button
                            className="mt-2"
                            colorScheme={"blue"}
                            isLoading={updateEmailMutation.isLoading}
                            onClick={() => updateEmailMutation.mutate()}>
                            Save
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Container>
    )
}

export default EmailNotConfirmed;