import { Tag, useDisclosure } from "@chakra-ui/react";
import TicketFormModal from "src/components/FormModals/Ticket";
import List from "src/components/List/List";
import ListItem from "src/components/List/ListItem";
import TicketListItemActions from "./ListItemActions";
import TicketListItemContent from "./ListItemContent";
import ListItemHeading from "./ListItemHeading";

type TicketListProps = {}

function TicketList(props: TicketListProps) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <List
                id="e72e4f55-d438-4f30-aaf6-a5c872f61e19"
                fetch={{
                    route: "tickets",
                    queryKey: "ticket"
                }}
                listItemRender={(item) => (
                    <ListItem
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
                )}
                header={{
                    title: "pending tickets",
                    showCount: true
                }}
                sort={[
                    {
                        property: "title"
                    },
                    {
                        property: "priority.name",
                        label: "priority"
                    },
                    {
                        property: "dueDate"
                    },
                ]}
                filter={[
                    {
                        property: "title",
                        label: "Title",
                        type: "string"
                    },
                    {
                        property: "priority.name",
                        label: "priority",
                        type: "string"
                    }
                ]}
                onAdd={onOpen}
            />
            <TicketFormModal
                isOpen={isOpen}
                onClose={onClose}
            />
        </>
    );
}

export default TicketList;