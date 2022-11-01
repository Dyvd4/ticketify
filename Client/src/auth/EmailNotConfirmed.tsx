import { Box, Button, Divider, Text, useToast } from "@chakra-ui/react";
import { useMutation } from "react-query";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { request } from "src/services/request";

interface EmailNotConfirmedProps { }

function EmailNotConfirmed(props: EmailNotConfirmedProps) {

    const toast = useToast();

    const mutation = useMutation(() => {
        return request().post("auth/confirmEmail");
    }, {
        onSuccess: () => {
            toast({
                status: "success",
                title: "Successfully sent e-mail"
            });
        }
    });

    return (
        <Box className="mt-10 flex gap-4">
            <Text as="h1" className="text-6xl">
                401
            </Text>
            <Divider orientation="vertical" />
            <Box className="flex flex-col ">
                <Text as="h3">
                    You e-mail has not been confirmed yet
                </Text>
                <Text as="p">
                    We sent you a verification link.
                    Click on it to get access to ticketify.
                </Text>
                <Text as="p">
                    In case you didn't get an e-mail, press the resend button and we will send you another e-mail.
                </Text>
                <Button
                    onClick={() => mutation.mutate()}
                    className="">
                    Resend
                </Button>
            </Box>
            {mutation.isLoading && <LoadingRipple centered />}
        </Box>
    )
}

export default EmailNotConfirmed;