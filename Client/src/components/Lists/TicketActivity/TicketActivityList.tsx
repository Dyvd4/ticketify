import { List } from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import { InfiniteQueryItems } from "src/components/List";
import TicketActivityListItem, { TicketActivityListItemProps } from "./TicketActivityListItem";
import { Variant } from "src/components/List/InfiniteQueryItems";

type TicketActivityListProps = {
    activitiesQuery: UseInfiniteQueryResult<any>
    ticketActivityListItemProps?: Partial<TicketActivityListItemProps>
    variant: Variant
}

function TicketActivityList({ activitiesQuery, ticketActivityListItemProps, variant }: TicketActivityListProps) {

    return (
        <List className="flex flex-col gap-4">
            <InfiniteQueryItems
                variant={variant}
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