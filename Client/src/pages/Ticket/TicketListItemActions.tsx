import { MenuItem } from "@chakra-ui/react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import TicketFormModal from "src/components/FormModals/Ticket";

function TicketListItemActions({ item }: { item }) {

    const editButtonRef = useRef<HTMLButtonElement | null>(null);

    return (
        <>
            <MenuItem
                ref={editButtonRef}
                icon={<FontAwesomeIcon icon={faEdit} />}>
                Edit
            </MenuItem>
            <TicketFormModal
                mountButtonRef={editButtonRef}
                id={item.id}
                variant="edit"
            />
        </>
    );
}

export default TicketListItemActions;