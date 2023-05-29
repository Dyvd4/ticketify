import { Heading, List, useDisclosure } from "@chakra-ui/react";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxSkeleton, ActionBoxProps } from "src/components/ActionBox";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import useToggle from "src/hooks/useToggle";
import { cn } from "src/utils/component";
import TicketListItem from "./components/TicketListItem";
import ConnectedTicketsAddModal from "./modals/ConnectedTicketsAddModal";
import ConnectedTicketsEditModal from "./modals/ConnectedTicketsEditModal";

type _TicketConnectionsActionBox = {};

export type TicketConnectionsActionBox = _TicketConnectionsActionBox &
	Omit<ActionBoxProps, keyof _TicketConnectionsActionBox>;

function TicketConnectionsActionBox({ className, ...props }: TicketConnectionsActionBox) {
	const { id } = useParams();
	const [isCollapsed, , toggleIsCollapsed] = useToggle(false);

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

	if (ticketLoading) return <ActionBoxSkeleton />;

	const connectedToTickets = ticket.connectedToTickets.map(
		(connectedToTicket) => connectedToTicket.connectedToTicket
	);
	const connectedByTickets = ticket.connectedByTickets.map(
		(connectedByTicket) => connectedByTicket.connectedByTicket
	);

	return (
		<ActionBox
			useCollapse
			isCollapsed={isCollapsed}
			toggleIsCollapsed={toggleIsCollapsed}
			className={cn("", className)}
			title={
				<>
					<span className="mr-2">Connected tickets</span>
					<FontAwesomeIcon icon={faLink} />
				</>
			}
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
			<Heading className="text-sm">To</Heading>
			<List className="mt-2 flex flex-col gap-4">
				{connectedToTickets.length > 0 ? (
					connectedToTickets.map((connectedTicket) => (
						<TicketListItem item={connectedTicket} key={connectedTicket.id} />
					))
				) : (
					<div className="flex items-center text-sm">No connected to tickets 😴</div>
				)}
			</List>
			<Heading className="mt-2 text-sm">By</Heading>
			<List className="mt-2 flex flex-col gap-4">
				{connectedByTickets.length > 0 ? (
					connectedByTickets.map((connectedTicket) => (
						<TicketListItem item={connectedTicket} key={connectedTicket.id} />
					))
				) : (
					<div className="flex items-center text-sm">No connected by tickets 😴</div>
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
