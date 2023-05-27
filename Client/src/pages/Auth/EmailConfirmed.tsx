import { Box, Button, Link } from "@chakra-ui/react";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { useCurrentUser } from "src/hooks/user";
import { isAuthenticated } from "../../auth/auth";

interface EmailConfirmedProps {}

function EmailConfirmed(props: EmailConfirmedProps) {
    const { currentUser, isLoading } = useCurrentUser();

    if (isLoading) return <LoadingRipple centered />;

    return (
        <>
            <Box className="mt-10 flex flex-col items-center justify-center">
                <h1 className="text-6xl">Your e-mail has been confirmed</h1>
                <Box className="mt-10">
                    {isAuthenticated(currentUser) && (
                        <>
                            <Link href="/">
                                <Button colorScheme={"green"}>Go to homepage</Button>
                            </Link>
                        </>
                    )}
                    {!isAuthenticated(currentUser) && (
                        <>
                            <Link href="/Auth/SignIn">
                                <Button colorScheme={"green"}>Sign in</Button>
                            </Link>
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default EmailConfirmed;
