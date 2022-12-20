import { List } from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import { InfiniteQueryItems } from "src/components/List";
import TicketActivityListItem, { TicketActivityListItemProps } from "./TicketActivityListItem";

type TicketActivityListProps = {
    activitiesQuery: UseInfiniteQueryResult<any>
    ticketActivityListItemProps?: Partial<TicketActivityListItemProps>
}

function TicketActivityList({ activitiesQuery, ticketActivityListItemProps }: TicketActivityListProps) {

    return (
        <List className="flex flex-col gap-4">
            <InfiniteQueryItems
                query={activitiesQuery}>
                {activity => (
                    <TicketActivityListItem
                        key={activity.id}
                        activity={activity}
                        {...ticketActivityListItemProps}
                    />
                )}
            </InfiniteQueryItems>
        </List>
    );
}

export default TicketActivityList;