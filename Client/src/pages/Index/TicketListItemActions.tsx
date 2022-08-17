import { Link, MenuItem } from "@chakra-ui/react";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TicketListItemActions({ item }: { item }) {
    return (
        <>
            <Link href="/Ticket/Create">
                <MenuItem icon={<FontAwesomeIcon icon={faPlus} />}>
                    Create
                </MenuItem>
            </Link>
            <Link href="Ticket/Edit">
                <MenuItem icon={<FontAwesomeIcon icon={faEdit} />}>
                    Edit
                </MenuItem>
            </Link>
        </>
    );
}

export default TicketListItemActions;