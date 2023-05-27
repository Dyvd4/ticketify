import { Tag } from "@chakra-ui/react";
import DefaultListItem from "src/components/List/ListItem";
import TicketListItemActions from "./ListItemActions";
import TicketListItemContent from "./ListItemContent";
import ListItemHeading from "./ListItemHeading";

function ListItem({ item }: { item }) {
    return (
        <DefaultListItem
            heading={<ListItemHeading item={item} />}
            content={<TicketListItemContent item={item} />}
            actions={<TicketListItemActions item={item} />}
            tags={[
                <Tag colorScheme={item.status.color}>Status: {item.status.name}</Tag>,
                <Tag colorScheme={item.priority.color}>Priority: {item.priority.name}</Tag>,
            ]}
        />
    );
}

export default ListItem;
