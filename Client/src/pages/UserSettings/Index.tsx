import { Alert, AlertIcon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Heading, Text } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import { useCurrentUserSettings } from "src/hooks/user";
import FilterAndSortPersistenceSection from "./sections/FilterAndSortPersistenceSection";

function UserSettingsIndex() {

    const { isLoading, isError } = useCurrentUserSettings();

    if (isLoading) return <LoadingRipple centered />

    if (isError) return (
        <Alert className="rounded-md" status="error" variant="top-accent">
            <AlertIcon />
            <Text>
                There was an error processing your request
            </Text>
        </Alert>
    )

    return (
        <Container className="mt-2" maxWidth={"container.md"}>
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
                        Settings
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Heading as="h1" className="font-bold text-2xl my-4">
                Settings
            </Heading>
            <FilterAndSortPersistenceSection />
        </Container>
    );
}

export default UserSettingsIndex;