import { Heading, List, TabPanel } from "@chakra-ui/react";
import { faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseInfiniteQueryResult } from "react-query";
import { InfiniteLoaderResultItems } from "src/components/List/Result";
import { ListItem } from "src/components/Lists/Ticket";

type AssignedTicketsPanelProps = {
	query: UseInfiniteQueryResult<any, any>;
	queryCount: number;
};

function AssignedTicketsPanel({ query, queryCount }: AssignedTicketsPanelProps) {
	return (
		<TabPanel>
			<Heading as="h1" className="text-2xl font-bold">
				Assigned tickets ({queryCount}) &nbsp;
				<FontAwesomeIcon icon={faTicketSimple} />
			</Heading>
			<List id="9151947b-ad33-44cd-bbcc-7e8316ba1439" className="mt-4 flex flex-col gap-4">
				<InfiniteLoaderResultItems variant="intersection-observer" query={query}>
					{(ticket) => <ListItem item={ticket} />}
				</InfiniteLoaderResultItems>
			</List>
		</TabPanel>
	);
}

export default AssignedTicketsPanel;
