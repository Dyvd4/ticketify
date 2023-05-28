import { Link, Tooltip, useToast } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateEntity } from "src/api/entity";
import Kanbanboard, { KanbanboardProps } from "src/components/Kanbanboard/Kanbanboard";
import { useQuery } from "src/hooks/query";

type TicketItem = { id: number; title: string; description: string; statusId: string };
type TicketQueryResponse = {
	items: KanbanboardProps<TicketItem>["groups"];
};

type _TicketKanbanboardProps = {};

export type TicketKanbanboardProps = PropsWithChildren<_TicketKanbanboardProps> &
	Omit<ComponentPropsWithRef<"div">, keyof _TicketKanbanboardProps>;

function TicketKanbanboard({ className, ...props }: TicketKanbanboardProps) {
	const queryClient = useQueryClient();
	const toast = useToast();

	const ticketStatusQuery = useQuery<any, any>(
		["ticketStatus"],
		{
			route: `ticketStatuses`,
		},
		{
			refetchOnWindowFocus: false,
		}
	);
	const ticketsQuery = useQuery<TicketQueryResponse, any>(
		["ticket"],
		{
			route: `ticketsAssignedGroupedByStatus`,
		},
		{
			refetchOnWindowFocus: false,
			enabled: ticketStatusQuery.isLoading,
		}
	);

	const ticketUpdateMutation = useMutation(
		({ groupName: statusName, item }: { groupName: string; item: TicketItem }) => {
			return updateEntity({
				route: "ticket",
				entityId: item.id.toString(),
				payload: {
					statusId: ticketStatusQuery.data.items.find((item) => item.name === statusName)
						.id,
				},
			});
		},
		{
			onSuccess() {
				toast({
					title: "Successfully changed status",
					status: "success",
				});
				queryClient.invalidateQueries(["ticketActivities"]);
			},
			onError() {
				toast({
					title: "An unknown error ocurred",
					status: "error",
				});
			},
		}
	);

	return (
		<Kanbanboard
			isLoading={ticketsQuery.isLoading}
			groups={ticketsQuery.data?.items || []}
			setGroups={(groups) => {
				queryClient.setQueryData(["ticket"], { items: groups });
			}}
			recentDroppedGroupIsLoading={ticketUpdateMutation.isLoading}
			groupItemsRenderer={(item) => (
				<Tooltip label={`Go to ticket`} placement="top-start">
					<Link href={`/Ticket/Details/${item.id}`}>
						#{item.id} {item.title}
					</Link>
				</Tooltip>
			)}
			orderByEvaluator={(a, b) => {
				return parseInt(a.title) - parseInt(b.title);
			}}
			onDrop={(groupName, item) => ticketUpdateMutation.mutate({ groupName, item })}
		/>
	);
}

export default TicketKanbanboard;
