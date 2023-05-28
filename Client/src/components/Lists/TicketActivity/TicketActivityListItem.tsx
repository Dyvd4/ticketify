import { Box, Link, ListItem, Text, Tooltip } from "@chakra-ui/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { IconName, faComment, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import BgBox from "src/components/BgBox";
import ShowMoreLabel from "src/components/ShowMoreLabel";

library.add(faComment, faTicket);

export type TicketActivityListItemProps = {
	activity: {
		ticket: any;
		title: string;
		icon: IconName;
		color: string;
		createdFrom: any;
		description?: string;
	};
	linkIsDisabled?: boolean;
	tooltipDisabled?: boolean;
};

const defaultNoOfContentLines = 4;

function TicketActivityListItem({
	activity,
	linkIsDisabled,
	tooltipDisabled,
}: TicketActivityListItemProps) {
	const contentBoxRef = useRef<HTMLDivElement | null>(null);
	const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);

	return (
		<ListItem>
			<BgBox className={`flex max-w-sm gap-2 overflow-hidden`}>
				<Box className="aspect-square rounded-full">
					<FontAwesomeIcon icon={activity.icon || "pen"} size={"lg"} />
				</Box>
				<Box className="min-w-0 flex-grow">
					<Box>
						{activity.ticket && (
							<>
								<Tooltip
									label={tooltipDisabled ? "" : `Go to ticket`}
									placement="top-start"
								>
									<Link
										href={
											linkIsDisabled
												? "#"
												: `/Ticket/Details/${activity.ticket.id}`
										}
										className="flex items-center justify-between gap-2 whitespace-nowrap hover:underline"
									>
										<div className="min-w-0 truncate">
											#{activity.ticket.id} {activity.ticket.title}
										</div>
										<Box color={activity.color} className={`text-sm`}>
											({activity.title})
										</Box>
									</Link>
								</Tooltip>
							</>
						)}
						{!activity.ticket && (
							<>
								<Text>(deleted ticket)</Text>
							</>
						)}
					</Box>
					<Box
						ref={contentBoxRef}
						noOfLines={noOfContentLines}
						className={`text-secondary text-sm ${!!activity.description ? "mt-1" : ""}`}
					>
						{activity.description}
					</Box>
					<ShowMoreLabel
						contentRef={contentBoxRef}
						contentNoOfLines={noOfContentLines}
						setContentNoOfLines={setNoOfContentLines}
						defaultContentNoOfLines={defaultNoOfContentLines}
					/>
				</Box>
			</BgBox>
		</ListItem>
	);
}

export default TicketActivityListItem;
