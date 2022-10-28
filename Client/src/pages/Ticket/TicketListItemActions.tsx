import { MenuItem, useDisclosure } from "@chakra-ui/react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TicketFormModal from "src/components/FormModals/Ticket";

function TicketListItemActions({ item }: { item }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <MenuItem
                onClick={onOpen}
                icon={<FontAwesomeIcon icon={faEdit} />}>
                Edit
            </MenuItem>
            <TicketFormModal
                isOpen={isOpen}
                onClose={onClose}
                id={item.id}
                variant="edit"
            />
        </>
    );
}

export default TicketListItemActions;