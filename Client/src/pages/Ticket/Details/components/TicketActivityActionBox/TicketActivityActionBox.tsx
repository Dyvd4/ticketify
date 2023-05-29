import { useParams } from "react-router-dom";
import ActionBox, { ActionBoxProps, ActionBoxSkeleton } from "src/components/ActionBox";
import TicketActivityList from "src/components/Lists/TicketActivity";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/query";
import useToggle from "src/hooks/useToggle";
import { cn } from "src/utils/component";

type _TicketActivityActionBox = {};

export type TicketActivityActionBox = _TicketActivityActionBox &
	Omit<ActionBoxProps, keyof _TicketActivityActionBox>;

function TicketActivityActionBox({ className, ...props }: TicketActivityActionBox) {
	const { id } = useParams();
	const [isCollapsed, , toggleIsCollapsed] = useToggle(false);

	// queries
	// -------
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

	if (activitiesQuery.isLoading) return <ActionBoxSkeleton />;

	return (
		<ActionBox
			useCollapse
			isCollapsed={isCollapsed}
			toggleIsCollapsed={toggleIsCollapsed}
			className={cn("", className)}
			title={`Activity (${activitiesCount})`}
			{...props}
		>
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
