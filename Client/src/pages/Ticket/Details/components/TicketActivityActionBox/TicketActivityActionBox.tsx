import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxProps } from "src/components/ActionBox";
import TicketActivityList from "src/components/Lists/TicketActivity";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/query";
import { cn } from "src/utils/component";

type _TicketActivityActionBox = {};

export type TicketActivityActionBox = _TicketActivityActionBox &
	Omit<ActionBoxProps, keyof _TicketActivityActionBox>;

function TicketActivityActionBox({ className, ...props }: TicketActivityActionBox) {
	const { id } = useParams();

	// queries
	// -------
	const {
		isLoading: ticketLoading,
		isError: ticketError,
		data: ticket,
	} = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

	const activitiesQuery = useInfiniteQuery<any, any>(
		["ticketActivities", id],
		{
			route: "ticketActivities",
			queryParams: {
				ticketId: id,
			},
		},
		{
			refetchInterval: 60000,
		}
	);
	const activitiesCount = useInfiniteQueryCount(activitiesQuery);
	// TODO: skeleton loading
	if (ticketLoading) return null;

	return (
		<ActionBox className={cn("", className)} title={`Activity (${activitiesCount})`} {...props}>
			<TicketActivityList
				variant={"load-more-button"}
				activitiesQuery={activitiesQuery}
				ticketActivityListItemProps={{
					linkIsDisabled: true,
					tooltipDisabled: true,
				}}
			/>
		</ActionBox>
	);
}

export default TicketActivityActionBox;
