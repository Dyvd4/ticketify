import { Tag } from "@chakra-ui/react";
import { VARIANT_MAP } from "src/components/BgBox";
import { ListItem } from "src/components/List";
import TicketListItemContent from "src/components/Lists/Ticket/ListItemContent";
import ListItemHeading from "src/components/Lists/Ticket/ListItemHeading";

type TicketListItemProps = {
    item: any
}

function TicketListItem({ item }: TicketListItemProps) {
    return (
        <ListItem
            key={item.id}
            className="w-full"
            _light={{
                bgColor: VARIANT_MAP.child._light.backgroundColor
            }}
            bgColor={VARIANT_MAP.child.backgroundColor}
            heading={<ListItemHeading item={item} />}
            content={<TicketListItemContent item={item} />}
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

export default TicketListItem;