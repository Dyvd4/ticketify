import { Tag, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity, updateEntity } from "src/api/entity";
import TagConfirmMenu from "src/components/TagConfirmMenu";

type SetStatusButtonProps = {};

function SetStatusButton(props: SetStatusButtonProps) {
	// hooks
	// -----
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { id } = useParams();
	const toast = useToast();
	const queryClient = useQueryClient();

	// queries
	// -------
	const { data: ticketStatusResponse, isLoading: ticketStatusIsLoading } = useQuery(
		["ticketStatus"],
		() => fetchEntity({ route: "ticketStatuses" })
	);
	const { data, isLoading: ticketIsLoading } = useQuery(["ticket", id]);

	// mutations
	// ---------
	const mutation = useMutation<any, any, any, any>(
		(newStatus) =>
			updateEntity({
				route: "ticket",
				entityId: id,
				payload: { statusId: newStatus.id },
			}),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["ticket", String(id)]);
				toast({
					status: "success",
					title: "successfully changed status",
				});
				onClose();
			},
		}
	);

	const getConfirmDialogText = (oldStatus, newStatus) => {
		return (
			<>
				<div>This will set the status from</div>
				<Tag colorScheme={oldStatus.color} className="mr-2">
					{oldStatus.name}
				</Tag>
				<span className="mr-2">to</span>
				<Tag colorScheme={newStatus.color} className="mr-2">
					{newStatus.name}
				</Tag>
				<span>?</span>
			</>
		);
	};

	const ticket = data as any;
	const isLoading = ticketIsLoading || ticketStatusIsLoading;
	if (isLoading || !ticketStatusResponse?.items || !ticket) return null;

	const status = ticket.status;

	return (
		<TagConfirmMenu
			className="text-xs"
			modalIsOpen={isOpen}
			onModalOpen={onOpen}
			onModalClose={onClose}
			mutation={mutation}
			confirmDialogBodyRenderer={getConfirmDialogText}
			selectedMenuItem={status}
			menuItems={ticketStatusResponse.items}
		/>
	);
}

export default SetStatusButton;
