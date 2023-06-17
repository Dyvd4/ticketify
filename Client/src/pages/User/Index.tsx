import { Alert, AlertIcon, Tab, Text } from "@chakra-ui/react";
import { faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import { fetchCurrentUserAll } from "src/api/user";
import DetailsPage from "src/components/DetailsPage";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/query";
import { useIsCurrentUser } from "src/hooks/user";
import AssignedTicketsPanel from "./sections/AssignedTicketsPanel";
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
	const isOwnSite = useIsCurrentUser(user);
	const ticketQuery = useInfiniteQuery<any, any>(["ticket"], {
		route: isOwnSite ? `tickets/assigned` : `tickets/assigned/${user.id}`,
	});
	const ticketQueryCount = useInfiniteQueryCount(ticketQuery);

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
		<DetailsPage
			leftSection={
				<>
					<AvatarSection user={user} />
					<UserDataSection user={user} />
				</>
			}
			rightSection={{
				tabList: [
					<Tab>
						assigned tickets ({ticketQueryCount}) &nbsp;
						<FontAwesomeIcon icon={faTicketSimple} />
					</Tab>,
				],
				tabPanels: [
					<AssignedTicketsPanel query={ticketQuery} queryCount={ticketQueryCount} />,
				],
			}}
		/>
	);
}
export default Index;
