import { Alert, AlertIcon, Heading, Text } from "@chakra-ui/react";
import LoadingRipple from "src/components/Loading/LoadingRippleWithPositioning";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import { useCurrentUserSettings } from "src/hooks/user";
import FilterAndSortPersistenceSection from "./sections/FilterAndSortPersistenceSection";

function UserSettingsIndex() {
	useBreadcrumb([
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Settings",
			href: "#",
			isCurrentPage: true,
		},
	]);

	const { isLoading, isError } = useCurrentUserSettings();

	if (isLoading) return <LoadingRipple />;

	if (isError)
		return (
			<Alert className="rounded-md" status="error" variant="top-accent">
				<AlertIcon />
				<Text>There was an error processing your request</Text>
			</Alert>
		);

	return (
		<>
			<Heading as="h1" className="my-4 text-2xl font-bold">
				Settings
			</Heading>
			<FilterAndSortPersistenceSection />
		</>
	);
}

export default UserSettingsIndex;
