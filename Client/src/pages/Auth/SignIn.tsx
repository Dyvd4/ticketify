import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "../../auth/auth";
import Card from "../../components/Card";

function SignIn() {
    return (
        <Card centered>
            <Heading as="h1" className="text-center mb-4 text-2xl md:text-3xl">
                Welcome to Ticketify
            </Heading>
            <VStack gap={2} className="px-10">
                <Button
                    className="flex justify-around items-center w-full"
                    onClick={signIn.withEmailLink}
                    colorScheme="cyan">
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Sign in with E-mail
                </Button>
                <Box>
                    OR
                </Box>
                <Button
                    onClick={signIn.withGoogle}
                    colorScheme={"blue"}
                    className="flex justify-around items-center w-full">
                    <FontAwesomeIcon icon={faGoogle} />
                    Sign in with Google
                </Button>
                <Button
                    onClick={signIn.withGithub}
                    colorScheme={"blue"}
                    className="flex justify-around items-center w-full">
                    <FontAwesomeIcon icon={faGithub} />
                    Sign in with GitHub
                </Button>
            </VStack>
        </Card>
    );
}

export default SignIn;