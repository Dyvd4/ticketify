import { Alert, AlertIcon, Container, Heading, Text } from "@chakra-ui/react";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import { useCurrentUserSettings } from "src/hooks/user";
import FilterAndSortPersistenceSection from "./sections/FilterAndSortPersistenceSection";

function UserSettingsIndex() {

    useBreadcrumb([
        {
            name: "Home",
            href: "/"
        },
        {
            name: "Settings",
            href: "#",
            isCurrentPage: true
        }
    ])

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
            <Heading as="h1" className="font-bold text-2xl my-4">
                Settings
            </Heading>
            <FilterAndSortPersistenceSection />
        </Container>
    );
}

export default UserSettingsIndex;