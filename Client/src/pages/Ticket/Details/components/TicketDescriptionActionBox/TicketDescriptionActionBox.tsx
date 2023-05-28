import { Box } from "@chakra-ui/react";
import dompurify from "dompurify";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxSkeleton, ActionBoxProps } from "src/components/ActionBox";
import { CONTENTSTATE } from "src/components/RichText/Editor";
import { cn } from "src/utils/component";
import { getTitle } from "src/utils/ticket";
import PinTicketButton from "../components/PinTicketButton";
import WatchTicketButton from "../components/WatchTicketButton";

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

	if (ticketLoading) return <ActionBoxSkeleton />;
	const { description } = ticket;

	return (
		<ActionBox
			className={cn("", className)}
			title={getTitle(ticket)}
			actions={[<PinTicketButton />, <WatchTicketButton />]}
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
		</ActionBox>
	);
}

export default TicketDescriptionActionBox;
