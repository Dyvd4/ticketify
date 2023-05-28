import { Alert, AlertIcon, Container, Divider, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import { fetchCurrentUserAll } from "src/api/user";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import AssignedTicketsSection from "./sections/AssignedTicketsSection";
import AvatarSection from "./sections/AvatarSection";
import UserDataSection from "./sections/UserDataSection";

type IndexProps = {};

function Index(props: IndexProps) {
	useBreadcrumb([
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Profile data",
			href: "#",
			isCurrentPage: true,
		},
	]);

	const { id } = useParams();
	const {
		data: user,
		isLoading,
		isError,
	} = useQuery(id ? ["user/all", id] : ["user/all"], () => {
		return id ? fetchEntity({ route: `user/all`, queryParams: { id } }) : fetchCurrentUserAll();
	});

	if (isLoading) {
		return <LoadingRipple centered />;
	}

	if (isError) {
		return (
			<Alert className="rounded-md" status="error" variant="top-accent">
				<AlertIcon />
				<Text>There was an error processing your request</Text>
			</Alert>
		);
	}

	return (
		<Container maxW="lg">
			<AvatarSection user={user} />
			<Divider className="my-2" />
			<UserDataSection user={user} />
			<Divider className="my-2" />
			<AssignedTicketsSection user={user} />
		</Container>
	);
}
export default Index;
