import { Heading, List, Text } from "@chakra-ui/react";
import { faSmile, faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfiniteQueryItems } from "src/components/List";
import ListItem from "src/components/List/ListItem";
import TicketListItemContent from "src/components/Lists/Ticket/ListItemContent";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/infiniteQuery";

type AssignedTicketsSectionsProps = {
    user: any
}

function AssignedTicketsSection({ user }: AssignedTicketsSectionsProps) {

    const query = useInfiniteQuery<any, any>(["ticket"], { route: "tickets/assigned" });
    const ticketCount = useInfiniteQueryCount(query);

    return (
        <>
            <Heading as="h1" className="font-bold text-2xl">
                Assigned tickets ({ticketCount}) &nbsp;
                <FontAwesomeIcon icon={faTicketSimple} />
            </Heading>
            <List className="flex flex-col gap-4 mt-4">
                <InfiniteQueryItems
                    query={query}>
                    {ticket => <ListItem content={<TicketListItemContent item={ticket} />} />}
                </InfiniteQueryItems>
            </List>
            {ticketCount === 0 && <>
                <Text className="text-secondary">
                    You don't have tickets assigned &nbsp;
                    <FontAwesomeIcon icon={faSmile} />
                </Text>
            </>}
        </>
    );
}

export default AssignedTicketsSection;