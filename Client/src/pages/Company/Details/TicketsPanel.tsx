import { List, TabPanel } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { UseInfiniteQueryResult } from "react-query";
import { InfiniteLoaderResultItems } from "src/components/List/Result";
import { ListItem } from "src/components/Lists/Ticket";

type _TicketsPanelProps = {
	query: UseInfiniteQueryResult<any, any>;
};

export type TicketsPanelProps = _TicketsPanelProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _TicketsPanelProps>;

function TicketsPanel({ className, query, ...props }: TicketsPanelProps) {
	return (
		<TabPanel>
			<List id="9151947b-ad33-44cd-bbcc-7e8316ba1439" className="flex flex-col gap-4">
				<InfiniteLoaderResultItems variant="intersection-observer" query={query}>
					{(ticket) => <ListItem item={ticket} />}
				</InfiniteLoaderResultItems>
			</List>
		</TabPanel>
	);
}

export default TicketsPanel;
