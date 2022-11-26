import { Heading, List, Text } from "@chakra-ui/react";
import { faSmile, faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfiniteQueryItems } from "src/components/List";
import ListItem from "src/components/List/ListItem";
import TicketListItemContent from "src/components/Lists/Ticket/ListItemContent";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/infiniteQuery";
import { useIsCurrentUser } from "src/hooks/user";

type AssignedTicketsSectionsProps = {
    user: any
}

function AssignedTicketsSection({ user }: AssignedTicketsSectionsProps) {

    const isOwnSite = useIsCurrentUser(user);
    const query = useInfiniteQuery<any, any>(["ticket"], { route: `tickets/assigned/${isOwnSite ? null : user.id}` });
    const ticketCount = useInfiniteQueryCount(query);

    return (
        <>
            <Heading as="h1" className="font-bold text-2xl">
                Assigned tickets ({ticketCount}) &nbsp;
                <FontAwesomeIcon icon={faTicketSimple} />
            </Heading>
            <List
                id="9151947b-ad33-44cd-bbcc-7e8316ba1439"
                className="flex flex-col gap-4 mt-4">
                <InfiniteQueryItems
                    query={query}>
                    {ticket => <ListItem content={<TicketListItemContent item={ticket} />} />}
                </InfiniteQueryItems>
            </List>
            {ticketCount === 0 && <>
                <Text className="text-secondary">
                    {isOwnSite ? "You don't have" : "He doesn't has"} tickets assigned &nbsp;
                    <FontAwesomeIcon icon={faSmile} />
                </Text>
            </>}
        </>
    );
}

export default AssignedTicketsSection;