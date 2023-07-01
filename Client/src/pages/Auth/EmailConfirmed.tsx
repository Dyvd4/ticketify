import { Box, Button, Link } from "@chakra-ui/react";
import useAuthState from "src/auth/hooks/useAuthState";
import LoadingRipple from "src/components/Loading/LoadingRippleWithPositioning";

interface EmailConfirmedProps {}

function EmailConfirmed(props: EmailConfirmedProps) {
	const { isLoading, isAuthenticated } = useAuthState();

	if (isLoading) return <LoadingRipple />;

	return (
		<>
			<Box className="mt-10 flex flex-col items-center justify-center">
				<h1 className="text-6xl">Your e-mail has been confirmed</h1>
				<Box className="mt-10">
					{isAuthenticated && (
						<>
							<Link href="/">
								<Button colorScheme={"green"}>Go to homepage</Button>
							</Link>
						</>
					)}
					{!isAuthenticated && (
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
