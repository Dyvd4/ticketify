import { List, TabPanel } from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import { InfiniteLoaderResultItems } from "src/components/List/Result";
import { ListItem } from "src/components/Lists/Ticket";

type AssignedTicketsPanelProps = {
	query: UseInfiniteQueryResult<any, any>;
};

function AssignedTicketsPanel({ query }: AssignedTicketsPanelProps) {
	return (
		<TabPanel>
			<List id="9151947b-ad33-44cd-bbcc-7e8316ba1439" className="mt-4 flex flex-col gap-4">
				<InfiniteLoaderResultItems variant="intersection-observer" query={query}>
					{(ticket) => <ListItem item={ticket} />}
				</InfiniteLoaderResultItems>
			</List>
		</TabPanel>
	);
}

export default AssignedTicketsPanel;
