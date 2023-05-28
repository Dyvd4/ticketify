import { Flex, Tag } from "@chakra-ui/react";
import { format } from "date-fns";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxProps } from "src/components/ActionBox";
import { cn } from "src/utils/component";

type _TicketHeadDataActionBoxProps = {};

export type TicketHeadDataActionBoxProps = _TicketHeadDataActionBoxProps &
	Omit<ActionBoxProps, keyof _TicketHeadDataActionBoxProps>;

function TicketHeadDataActionBox({ className, ...props }: TicketHeadDataActionBoxProps) {
	const { id } = useParams();
	// queries
	// -------
	const {
		isLoading: ticketLoading,
		isError: ticketError,
		data: ticket,
	} = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

	// TODO: skeleton loading
	if (ticketLoading) return null;

	const { priority, status, dueDate, responsibleUser, description } = ticket;

	return (
		<ActionBox title="Meta data" className={cn("", className)} {...props}>
			<Flex gap={2} direction="column" className="text-secondary">
				<Flex justifyContent="space-between">
					<div>priority</div>
					<Tag colorScheme={priority.color}>{priority.name}</Tag>
				</Flex>
				<Flex justifyContent="space-between">
					<div>status</div>
					<Tag colorScheme={status.color}>{status?.name || "none"}</Tag>
				</Flex>
				<Flex justifyContent="space-between">
					<div>due date</div>
					<div>{dueDate ? format(new Date(dueDate), "dd.mm.yyyy hh:mm:ss") : "-"}</div>
				</Flex>
				<Flex justifyContent="space-between">
					<div>responsible user</div>
					<div>{responsibleUser?.username || "-"}</div>
				</Flex>
			</Flex>
		</ActionBox>
	);
}

export default TicketHeadDataActionBox;
