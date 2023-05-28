import { Box, useDisclosure } from "@chakra-ui/react";
import dompurify from "dompurify";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxProps } from "src/components/ActionBox";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import TicketFormModal from "src/components/FormModals/Ticket";
import { CONTENTSTATE } from "src/components/RichText/Editor";
import { cn } from "src/utils/component";
import { getTitle } from "src/utils/ticket";
import PinTicketButton from "./components/PinTicketButton";
import SetResponsibleUserButton from "./components/SetResponsibleUserButton";
import SetStatusButton from "./components/SetStatusButton";
import WatchTicketButton from "./components/WatchTicketButton";

type _TicketDescriptionActionBoxProps = {};

export type TicketDescriptionActionBoxProps = _TicketDescriptionActionBoxProps &
	Omit<ActionBoxProps, keyof _TicketDescriptionActionBoxProps>;

function TicketDescriptionActionBox({ className, ...props }: TicketDescriptionActionBoxProps) {
	const { id } = useParams();
	// queries
	// -------
	const {
		isLoading: ticketLoading,
		isError: ticketError,
		data: ticket,
	} = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

	// state
	// -----
	const {
		isOpen: ticketFormModalIsOpen,
		onOpen: onTicketFormModalOpen,
		onClose: onTicketFormModalClose,
	} = useDisclosure();
	const [ticketFormModalVariant, setTicketFormModalVariant] = useState<"add" | "edit">("add");

	// event handler
	// -------------
	const handleOnTicketFormModalOpen = (variant) => {
		setTicketFormModalVariant(variant);
		onTicketFormModalOpen();
	};

	// TODO: skeleton loading
	if (ticketLoading) return null;

	const { description } = ticket;

	return (
		<ActionBox
			className={cn("", className)}
			title={getTitle(ticket)}
			actions={[
				<PinTicketButton />,
				<WatchTicketButton />,
				<TooltipIconButton
					variant="edit"
					tooltipProps={{
						label: "edit ticket",
					}}
					iconButtonProps={{
						onClick: () => handleOnTicketFormModalOpen("edit"),
						size: "sm",
					}}
				/>,
				<SetStatusButton />,
			]}
			menuActions={[
				// TODO: make menu items
				<SetResponsibleUserButton />,
			]}
			menuButtonSize={"sm"}
			{...props}
		>
			<Box
				dangerouslySetInnerHTML={{
					__html: dompurify.sanitize(
						description === CONTENTSTATE.EMPTY ? "No description" : description
					),
				}}
			></Box>
			{ticketFormModalVariant === "edit" && (
				<>
					<TicketFormModal
						id={id}
						isOpen={ticketFormModalIsOpen}
						onClose={onTicketFormModalClose}
						variant={ticketFormModalVariant}
					/>
				</>
			)}
		</ActionBox>
	);
}

export default TicketDescriptionActionBox;
