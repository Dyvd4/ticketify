import { useDisclosure } from "@chakra-ui/react";
import TicketFormModal from "src/components/FormModals/Ticket";
import List from "src/components/List/List";
import ListItem from "./ListItem";

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
                listItemRender={(item) => <ListItem item={item} />}
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