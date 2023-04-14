import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { mutatePinnedTicket, useTicketIsPinned } from "src/api/pinned-ticket";
import { useCurrentUser } from "src/hooks/user";

type PinTicketButtonProps = {}

function PinTicketButton(props: PinTicketButtonProps) {

    // hooks
    // -----
    const toast = useToast();
    const queryClient = useQueryClient();
    const { isLoading: currentUserIsLoading, refetch } = useCurrentUser({ includeAllEntities: true });
    const { id: ticketId } = useParams();

    const [ticketIsPinned] = useTicketIsPinned(+ticketId!);

    const mutation = useMutation(() => {
        return mutatePinnedTicket(ticketId!, ticketIsPinned);
    }, {
        onSuccess: async () => {
            await refetch();
            await queryClient.invalidateQueries(["pinnedTickets"]);
            // TODO: make undo available
            toast({
                status: "success",
                title: `successfully ${ticketIsPinned ? "pinned" : "unpinned"} ticket`
            });
        }
    })

    const isLoading = mutation.isLoading || currentUserIsLoading;

    return (
        <Tooltip
            label={ticketIsPinned ? "Unpin" : "Pin"}
            placement="top">
            <IconButton
                aria-label="pin ticket"
                isLoading={isLoading}
                onClick={() => mutation.mutate()}
                size={"sm"}
                icon={<FontAwesomeIcon icon={faThumbTack} />}>
            </IconButton>
        </Tooltip>
    );
}

export default PinTicketButton;