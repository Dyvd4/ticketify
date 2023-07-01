import { Alert, AlertIcon, Tab, Text } from "@chakra-ui/react";
import { faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import DetailsPage from "src/components/DetailsPage";
import LoadingRipple from "src/components/Loading/LoadingRippleWithPositioning";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/query";
import { useIsCurrentUser } from "src/hooks/user";
import AssignedTicketsPanel from "./sections/AssignedTicketsPanel";
import HeadSection from "./sections/HeadSection";
import UserDataPanel from "./sections/UserDataPanel";

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
	} = useQuery(["user/all", id], () => {
		return fetchEntity({ route: id ? `user/${id}/all` : "user/all" });
	});
	const isOwnSite = useIsCurrentUser(user ? user : {});
	const ticketQuery = useInfiniteQuery<any, any>(["tickets/assigned"], {
		route: isOwnSite ? `tickets/assigned` : `tickets/assigned/${user?.id}`,
	});
	const ticketQueryCount = useInfiniteQueryCount(ticketQuery);

	if (isLoading) {
		return <LoadingRipple />;
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
			head={
				<>
					<HeadSection user={user} />
				</>
			}
			body={{
				tabList: [
					<Tab>
						assigned tickets ({ticketQueryCount}) &nbsp;
						<FontAwesomeIcon icon={faTicketSimple} />
					</Tab>,
					<Tab>user data</Tab>,
				],
				tabPanels: [
					<AssignedTicketsPanel query={ticketQuery} />,
					<UserDataPanel user={user} />,
				],
			}}
		/>
	);
}
export default Index;
