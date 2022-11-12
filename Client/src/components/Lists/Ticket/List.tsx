import { useDisclosure } from "@chakra-ui/react";
import TicketFormModal from "src/components/FormModals/Ticket";
import List from "src/components/List/List";
import ListItem from "src/components/List/ListItem";
import TicketListItemActions from "./ListItemActions";
import TicketListItemContent from "./ListItemContent";

type TicketListProps = {}

function TicketList(props: TicketListProps) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <List
                fetch={{
                    route: "tickets",
                    queryKey: "ticket"
                }}
                listItemRender={(item) => (
                    <ListItem
                        content={<TicketListItemContent item={item} />}
                        actions={<TicketListItemActions item={item} />}
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