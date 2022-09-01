import { Alert, AlertIcon, Container, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { fetchUser } from "src/api/user";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import UserDataSection from "./sections/UserDataSection";

type IndexProps = {}

function Index(props: IndexProps) {

    const { data, isLoading, isError, refetch } = useQuery(["user"], fetchUser);

    if (isLoading) {
        return <LoadingRipple centered />
    }

    if (isError) {
        return (
            <Alert className="rounded-md" status="error" variant="top-accent">
                <AlertIcon />
                <Text>
                    There was an error processing your request
                </Text>
            </Alert>
        )
    }

    return (
        <Container className="mt-4" maxW="sm">
            <UserDataSection
                user={data.user}
                refetch={refetch}
            />
        </Container>
    )
}
export default Index