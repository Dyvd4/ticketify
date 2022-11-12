import { Alert, AlertIcon, Container, Divider, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { fetchUserAll } from "src/api/user";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import AssignedTicketsSection from "./sections/AssignedTicketsSection";
import AvatarSection from "./sections/AvatarSection";
import UserDataSection from "./sections/UserDataSection";

type IndexProps = {}

function Index(props: IndexProps) {

    const { data, isLoading, isError } = useQuery(["user/all"], fetchUserAll);

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
        <Container className="mt-4" maxW="lg">
            <AvatarSection user={data.user} />
            <Divider className="my-2" />
            <UserDataSection user={data.user} />
            <Divider className="my-2" />
            <AssignedTicketsSection user={data.user} />
        </Container>
    )
}
export default Index