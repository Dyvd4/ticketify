import { Heading } from "@chakra-ui/react";
import ErrorAlert from "src/components/ErrorAlert";
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

	if (isError) return <ErrorAlert />;

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
