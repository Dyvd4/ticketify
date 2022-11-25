import { Alert, AlertIcon, Container, Divider, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import { fetchCurrentUserAll } from "src/api/user";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import AssignedTicketsSection from "./sections/AssignedTicketsSection";
import AvatarSection from "./sections/AvatarSection";
import UserDataSection from "./sections/UserDataSection";

type IndexProps = {}

function Index(props: IndexProps) {

    const { id } = useParams();
    const {
        data: user,
        isLoading,
        isError
    } = useQuery(id
        ? ["user/all", id]
        : ["user/all"], () => {
            return id
                ? fetchEntity({ route: `user/all`, queryParams: { id } })
                : fetchCurrentUserAll()
        });

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
            <Breadcrumb
                className="font-bold mt-4"
                separator={<FontAwesomeIcon icon={faChevronRight} size="xs" />}>
                <BreadcrumbItem className="text-secondary-hover">
                    <BreadcrumbLink href="/">
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem className="text-secondary-hover">
                    <BreadcrumbLink href="#" isCurrentPage>
                        Profile data
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <AvatarSection user={user} />
            <Divider className="my-2" />
            <UserDataSection user={user} />
            <Divider className="my-2" />
            <AssignedTicketsSection user={user} />
        </Container>
    )
}
export default Index