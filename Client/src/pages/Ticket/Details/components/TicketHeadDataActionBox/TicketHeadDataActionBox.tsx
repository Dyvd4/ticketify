import { Flex, Tag, useDisclosure } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxSkeleton, ActionBoxProps } from "src/components/ActionBox";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import TicketFormModal from "src/components/FormModals/Ticket";
import useToggle from "src/hooks/useToggle";
import { cn } from "src/utils/component";
import SetResponsibleUserButton from "../SetResponsibleUserButton";
import SetStatusButton from "../SetStatusButton";

type _TicketHeadDataActionBoxProps = {};

export type TicketHeadDataActionBoxProps = _TicketHeadDataActionBoxProps &
	Omit<ActionBoxProps, keyof _TicketHeadDataActionBoxProps>;

function TicketHeadDataActionBox({ className, ...props }: TicketHeadDataActionBoxProps) {
	const { id } = useParams();
	const [ticketFormModalVariant, setTicketFormModalVariant] = useState<"add" | "edit">("add");
	const [isCollapsed, , toggleIsCollapsed] = useToggle(false);

	// queries
	// -------
	const {
		isLoading: ticketLoading,
		isError: ticketError,
		data: ticket,
		isStale,
	} = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));
	console.log(
		"🚀 ~ file: TicketHeadDataActionBox.tsx:33 ~ TicketHeadDataActionBox ~ isStale:",
		isStale
	);

	const {
		isOpen: ticketFormModalIsOpen,
		onOpen: onTicketFormModalOpen,
		onClose: onTicketFormModalClose,
	} = useDisclosure();

	const handleOnTicketFormModalOpen = (variant) => {
		setTicketFormModalVariant(variant);
		onTicketFormModalOpen();
	};

	if (ticketLoading) return <ActionBoxSkeleton />;
	const { priority, dueDate, responsibleUser } = ticket;

	return (
		<ActionBox
			useCollapse
			isCollapsed={isCollapsed}
			toggleIsCollapsed={toggleIsCollapsed}
			useDivider
			title="Meta data"
			className={cn("", className)}
			actions={[
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
			]}
			{...props}
		>
			<Flex gap={4} direction="column" className="text-secondary">
				<Flex justifyContent="space-between">
					<div>priority</div>
					<Tag colorScheme={priority.color}>{priority.name}</Tag>
				</Flex>
				<Flex justifyContent="space-between">
					<div>status</div>
					<div className="flex-gap-2">
						<SetStatusButton />
					</div>
				</Flex>
				<Flex justifyContent="space-between">
					<div>due date</div>
					<div>{dueDate ? format(new Date(dueDate), "dd.mm.yyyy hh:mm:ss") : "-"}</div>
				</Flex>
				<Flex justifyContent="space-between">
					<div>responsible user</div>
					<div className="flex items-center justify-center gap-2">
						{responsibleUser?.username || "-"}
						<SetResponsibleUserButton />
					</div>
				</Flex>
			</Flex>
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

export default TicketHeadDataActionBox;
