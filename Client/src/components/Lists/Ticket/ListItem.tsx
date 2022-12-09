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
                <Tag className={`bg-${item.status?.color || "bg-gray-200"}`}>
                    Status: {item.status?.name || "none"}
                </Tag>,
                <Tag className={`bg-${item.priority.color}`}>
                    Priority: {item.priority.name}
                </Tag>
            ]}
        />
    );
}

export default ListItem;