import { Flex, Heading } from "@chakra-ui/react";
import TicketActivityList from "src/components/Lists/TicketActivity/TicketActivityList";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import { useInfiniteQuery } from "src/hooks/query";
import TicketKanbanboard from "./components/TicketKanbanboard";

interface IndexProps {}

function Index(props: IndexProps) {
	const activitiesQuery = useInfiniteQuery<any, any>(["ticketActivities"], {
		route: "ticketActivities",
	});

	useBreadcrumb([
		{
			name: "Home",
			href: "#",
			isCurrentPage: true,
		},
	]);

	return (
		<>
			<Heading className="my-4 text-2xl" as="h1">
				Tickets by status test
			</Heading>
			<TicketKanbanboard />
			<Heading className="mt-8 mb-4 text-2xl" as="h1">
				Lists
			</Heading>
			<Flex className="items-center justify-center">
				<div>tickets</div>
				<div>add ticket</div>
			</Flex>
			<Heading className="mt-8 mb-4 text-2xl" as="h1">
				Recent activity
			</Heading>
			<TicketActivityList variant="intersection-observer" activitiesQuery={activitiesQuery} />
		</>
	);
}

export default Index;
