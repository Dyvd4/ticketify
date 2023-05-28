import { Heading, List, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxProps } from "src/components/ActionBox";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import { cn } from "src/utils/component";
import ListItem from "./components/TicketListItem";
import ConnectedTicketsAddModal from "./modals/ConnectedTicketsAddModal";
import ConnectedTicketsEditModal from "./modals/ConnectedTicketsEditModal";

type _TicketConnectionsActionBox = {};

export type TicketConnectionsActionBox = _TicketConnectionsActionBox &
	Omit<ActionBoxProps, keyof _TicketConnectionsActionBox>;

function TicketConnectionsActionBox({ className, ...props }: TicketConnectionsActionBox) {
	const { id } = useParams();

	const {
		isOpen: connectedTicketsAddModalIsOpen,
		onOpen: onConnectedTicketsAddModalOpen,
		onClose: onConnectedTicketsAddModalClose,
	} = useDisclosure();
	const {
		isOpen: connectedTicketsEditModalIsOpen,
		onOpen: onConnectedTicketsEditModalOpen,
		onClose: onConnectedTicketsEditModalClose,
	} = useDisclosure();
	// queries
	// -------
	const {
		isLoading: ticketLoading,
		isError: ticketError,
		data: ticket,
	} = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

	// TODO: skeleton loading
	if (ticketLoading) return null;

	const connectedToTickets = ticket.connectedToTickets.map(
		(connectedToTicket) => connectedToTicket.connectedToTicket
	);
	const connectedByTickets = ticket.connectedByTickets.map(
		(connectedByTicket) => connectedByTicket.connectedByTicket
	);
	return (
		<ActionBox
			className={cn("", className)}
			title="Connected tickets"
			actions={[
				<TooltipIconButton
					variant="add"
					tooltipProps={{
						label: "add connection",
					}}
					iconButtonProps={{
						onClick: onConnectedTicketsAddModalOpen,
						size: "xs",
					}}
				/>,
				<TooltipIconButton
					variant="edit"
					tooltipProps={{
						label: "edit connections",
					}}
					iconButtonProps={{
						disabled: connectedToTickets.concat(connectedByTickets).length === 0,
						onClick: onConnectedTicketsEditModalOpen,
						size: "xs",
					}}
				/>,
			]}
			{...props}
		>
			<Heading className="text-base">Connected to:</Heading>
			<List className="my-2 flex flex-col gap-4">
				{connectedToTickets.length > 0 ? (
					connectedToTickets.map((connectedTicket) => (
						<ListItem item={connectedTicket} key={connectedTicket.id} />
					))
				) : (
					<div className="flex items-center">No connected tickets</div>
				)}
			</List>
			<Heading className="text-base">Connected by:</Heading>
			<List className="my-2 flex flex-col gap-4">
				{connectedByTickets.length > 0 ? (
					connectedByTickets.map((connectedTicket) => (
						<ListItem item={connectedTicket} key={connectedTicket.id} />
					))
				) : (
					<div className="flex items-center">No connected tickets</div>
				)}
			</List>
			<ConnectedTicketsAddModal
				connectedByTickets={connectedByTickets}
				connectedToTickets={connectedToTickets}
				isOpen={connectedTicketsAddModalIsOpen}
				onClose={onConnectedTicketsAddModalClose}
			/>
			<ConnectedTicketsEditModal
				connectedByTickets={connectedByTickets}
				connectedToTickets={connectedToTickets}
				isOpen={connectedTicketsEditModalIsOpen}
				onClose={onConnectedTicketsEditModalClose}
			/>
		</ActionBox>
	);
}

export default TicketConnectionsActionBox;
