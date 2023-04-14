import { Box, Button, useDisclosure } from '@chakra-ui/react';
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
        <Box className={`${className}`}>
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
                    <PinnedTicketItem pinnedTicket={pinnedTicket} />
                ))}
            </Box>

            <PinnedTicketsAddModal
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
}

export default PinnedTicketsSection;