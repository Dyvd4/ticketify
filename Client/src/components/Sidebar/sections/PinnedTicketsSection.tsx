import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { faAdd, faThumbTack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import { usePinnedTickets } from 'src/api/pinned-ticket';
import PinnedTicketsAddModal from '../modals/PinnedTicketsAddModal';
import { SidebarListItem } from '../SidebarListItem';
import { Variant } from '../SidebarListItem/BaseSidebarListItem';
import PinnedTicketItem from './PinnedTicketItem';

type _PinnedTicketsSectionProps = {
    sidebarListItemVariant: Variant
}

export type PinnedTicketsSectionProps = PropsWithChildren<_PinnedTicketsSectionProps> &
    Omit<ComponentPropsWithRef<'div'>, keyof _PinnedTicketsSectionProps>

function PinnedTicketsSection({ className, sidebarListItemVariant, ...props }: PinnedTicketsSectionProps) {

    const { isOpen, onClose, onOpen } = useDisclosure();
    const [pinnedTickets, isLoading] = usePinnedTickets();

    return (
        <Box className={`${className}`}>
            {sidebarListItemVariant === "horizontal" && <>
                <Box className='flex justify-between items-center text-sm'>
                    Pinned tickets
                    <Button
                        onClick={onOpen}
                        size="xs"
                        className='flex gap-1'>
                        Add
                        <FontAwesomeIcon icon={faAdd} />
                    </Button>
                </Box>

                <Box className='mt-4 flex flex-col gap-1'>
                    {!isLoading && pinnedTickets.map(pinnedTicket => (
                        <PinnedTicketItem pinnedTicket={pinnedTicket} key={pinnedTicket.id} />
                    ))}
                </Box>
            </>}

            {sidebarListItemVariant === "vertical" && <>
                <SidebarListItem
                    title={pinnedTickets?.length || 0}
                    urlPath={"#"}
                    variant={sidebarListItemVariant}
                    icon={faThumbTack}
                />
            </>}

            <PinnedTicketsAddModal
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
}

export default PinnedTicketsSection;