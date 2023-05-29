import { Heading, TabsProps } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import Attachments from "./Attachments";

type _TicketAttachmentsActionBoxContentProps = {};

export type TicketAttachmentsActionBoxContentProps = _TicketAttachmentsActionBoxContentProps &
	Omit<Omit<TabsProps, "children">, keyof _TicketAttachmentsActionBoxContentProps>;

function TicketAttachmentsActionBoxContent({
	className,
	...props
}: TicketAttachmentsActionBoxContentProps) {
	const { id } = useParams();

	const {
		isLoading: ticketAttachmentsLoading,
		isError: ticketAttachmentsError,
		data: ticketAttachments,
	} = useQuery(
		["ticket/attachments", id],
		() => fetchEntity({ route: `ticket/attachments/${id}` }),
		{
			refetchOnWindowFocus: false,
		}
	);

	if (ticketAttachmentsLoading) return null;
	const { files, images, attachments } = ticketAttachments;

	return (
		<>
			<Heading className="text-base">Images ({images.length})</Heading>
			<Attachments attachments={images} variant="images" />
			<Heading className="text-base">Files ({files.length})</Heading>
			<Attachments attachments={files} variant="files" />
			<Heading className="text-base">All ({attachments.length})</Heading>
			<Attachments attachments={attachments} variant="all" />
		</>
	);
}

export default TicketAttachmentsActionBoxContent;
