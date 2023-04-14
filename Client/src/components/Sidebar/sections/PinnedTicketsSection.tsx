import { Box, Tooltip, useDisclosure } from '@chakra-ui/react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import { usePinnedTickets } from 'src/api/pinned-ticket';
import PinnedTicketsAddModal from '../modals/PinnedTicketsAddModal';
import PinnedTicketItem from './PinnedTicketItem';

type _PinnedTicketsSectionProps = {}

export type PinnedTicketsSectionProps = PropsWithChildren<_PinnedTicketsSectionProps> &
    Omit<ComponentPropsWithRef<'div'>, keyof _PinnedTicketsSectionProps>

function PinnedTicketsSection({ className, ...props }: PinnedTicketsSectionProps) {

    const { isOpen, onClose, onOpen } = useDisclosure();
    const [pinnedTickets, isLoading] = usePinnedTickets();

    return (
        <>
            <Box className='flex justify-between text-sm' mr={2}>
                Pinned tickets
                <Tooltip
                    onClick={onOpen}
                    placement="top"
                    label="add"
                    shouldWrapChildren>
                    <FontAwesomeIcon icon={faAdd} />
                </Tooltip>
            </Box>

            {!isLoading && pinnedTickets.map(pinnedTicket => (
                <PinnedTicketItem pinnedTicket={pinnedTicket} />
            ))}

            <PinnedTicketsAddModal
                isOpen={isOpen}
                onClose={onClose}
            />
        </>
    );
}

export default PinnedTicketsSection;