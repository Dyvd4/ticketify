import { Button, IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import TicketFormModal from "src/components/FormModals/Ticket";
import useSidebarToggle from 'src/context/hooks/useSidebarToggle';

type _NewTicketSectionProps = {}

export type NewTicketSectionProps = _NewTicketSectionProps &
    Omit<PropsWithChildren<ComponentPropsWithRef<'div'>>, keyof _NewTicketSectionProps>

function NewTicketSection({ className, ...props }: NewTicketSectionProps) {

    const [sidebarIsCollapsed] = useSidebarToggle();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const sidebarListItemVariant = !sidebarIsCollapsed ? "horizontal" : "vertical";

    return (
        <>
            {sidebarListItemVariant === "horizontal" && <>
                <Button
                    onClick={onOpen}
                    className='my-4'
                    leftIcon={<FontAwesomeIcon icon={faAdd} />}>
                    New ticket
                </Button>
            </>}

            {sidebarListItemVariant === "vertical" && <>
                <Tooltip
                    label="New ticket"
                    placement="top"
                    aria-label="New ticket">
                    <span className="flex justify-center items-center">
                        <IconButton
                            size={"sm"}
                            onClick={onOpen}
                            aria-label="add"
                            icon={<FontAwesomeIcon icon={faAdd} />}
                        />
                    </span>
                </Tooltip>
            </>}

            <TicketFormModal
                isOpen={isOpen}
                onClose={onClose}
            />
        </>
    );
}

export default NewTicketSection;