import { IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { faEye as farEye } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { addEntity, removeEntity } from "src/api/entity";
import { useCurrentUser } from "src/hooks/user";

type WatchTicketButtonProps = {};

function WatchTicketButton(props: WatchTicketButtonProps) {
	// hooks
	// -----
	const toast = useToast();
	const {
		currentUser,
		isLoading: currentUserIsLoading,
		refetch,
	} = useCurrentUser({ includeAllEntities: true });
	const { id: ticketId } = useParams();

	const mutation = useMutation(
		() => {
			const isWatchingToCurrentTicket = currentUser.watchingTickets.find(
				(watchingTicket) => watchingTicket.ticket.id === parseInt(ticketId!)
			);
			return isWatchingToCurrentTicket
				? removeEntity({
						route: `ticketWatcher/${currentUser.id}/${ticketId}`,
				  })
				: addEntity({
						route: "ticketWatcher",
						payload: {
							userId: currentUser.id,
							ticketId,
						},
				  });
		},
		{
			onSuccess: async () => {
				await refetch();
				toast({
					status: "success",
					title: "successfully changed watching state",
				});
			},
		}
	);

	const isLoading = mutation.isLoading || currentUserIsLoading;
	const isWatching =
		currentUser &&
		currentUser.watchingTickets.find(
			(watchingTicket) => watchingTicket.ticket.id === parseInt(ticketId!)
		);

	return (
		<Tooltip label={isWatching ? "unwatch ticket" : "watch ticket"} placement="top">
			<IconButton
				isActive={isWatching}
				isLoading={isLoading}
				aria-label="watch ticket"
				onClick={() => mutation.mutate()}
				size={"sm"}
				icon={<FontAwesomeIcon icon={isWatching ? faEye : farEye} />}
			/>
		</Tooltip>
	);
}

export default WatchTicketButton;