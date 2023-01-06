import { Heading, List } from "@chakra-ui/react";
import { faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfiniteLoaderResultItems } from "src/components/List/Result";
import { ListItem } from "src/components/Lists/Ticket";
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
                <InfiniteLoaderResultItems
                    variant="intersection-observer"
                    query={query}>
                    {ticket => <ListItem item={ticket} />}
                </InfiniteLoaderResultItems>
            </List>
        </>
    );
}

export default AssignedTicketsSection;