import { Link, MenuItem } from "@chakra-ui/react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TicketListItemActions({ item }: { item }) {
    return (
        <>
            <Link href="Ticket/Edit">
                <MenuItem icon={<FontAwesomeIcon icon={faEdit} />}>
                    Edit
                </MenuItem>
            </Link>
        </>
    );
}

export default TicketListItemActions;