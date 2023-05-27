import { List } from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import { InfiniteLoaderResultItems } from "src/components/List/Result";
import TicketActivityListItem, { TicketActivityListItemProps } from "./TicketActivityListItem";
import { Variant } from "src/components/List/Result/InfiniteLoaderResultItems";

type TicketActivityListProps = {
    activitiesQuery: UseInfiniteQueryResult<any>;
    ticketActivityListItemProps?: Partial<TicketActivityListItemProps>;
    variant: Variant;
};

function TicketActivityList({
    activitiesQuery,
    ticketActivityListItemProps,
    variant,
}: TicketActivityListProps) {
    return (
        <List className="flex flex-col gap-4">
            <InfiniteLoaderResultItems variant={variant} query={activitiesQuery}>
                {(activity) => (
                    <TicketActivityListItem
                        key={activity.id}
                        activity={activity}
                        {...ticketActivityListItemProps}
                    />
                )}
            </InfiniteLoaderResultItems>
        </List>
    );
}

export default TicketActivityList;
