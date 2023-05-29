import { useDisclosure } from "@chakra-ui/react";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import ActionBox, { ActionBoxSkeleton, ActionBoxProps } from "src/components/ActionBox";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import useToggle from "src/hooks/useToggle";
import { cn } from "src/utils/component";
import TicketAttachmentsActionBoxContent from "./components/TicketAttachmentsActionBoxContent";
import AttachmentsAddModal from "./modals/AttachmentsAddModal";
import AttachmentsEditModal from "./modals/AttachmentsEditModal";

type _TicketAttachmentsActionBoxProps = {};

export type TicketAttachmentsActionBoxProps = _TicketAttachmentsActionBoxProps &
	Omit<ActionBoxProps, keyof _TicketAttachmentsActionBoxProps>;

function TicketAttachmentsActionBox({ className, ...props }: TicketAttachmentsActionBoxProps) {
	const { id } = useParams();
	const [isCollapsed, , toggleIsCollapsed] = useToggle(false);

	// state
	// -----
	const {
		isOpen: attachmentsEditModalIsOpen,
		onOpen: onAttachmentsEditModalOpen,
		onClose: onAttachmentsEditModalClose,
	} = useDisclosure();
	const {
		isOpen: attachmentsAddModalIsOpen,
		onOpen: onAttachmentsAddModalOpen,
		onClose: onAttachmentsAddModalClose,
	} = useDisclosure();

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

	if (ticketAttachmentsLoading) return <ActionBoxSkeleton />;
	const { attachments } = ticketAttachments;

	return (
		<ActionBox
			useCollapse
			isCollapsed={isCollapsed}
			toggleIsCollapsed={toggleIsCollapsed}
			className={cn("", className)}
			title={
				<>
					<span className="mr-2">Attachments</span>
					<FontAwesomeIcon icon={faFile} />
				</>
			}
			actions={[
				<TooltipIconButton
					variant="add"
					tooltipProps={{
						label: "add attachment",
					}}
					iconButtonProps={{
						onClick: onAttachmentsAddModalOpen,
						size: "xs",
					}}
				/>,
				<TooltipIconButton
					variant="edit"
					tooltipProps={{
						label: "edit attachments",
					}}
					iconButtonProps={{
						disabled: attachments.length === 0,
						onClick: onAttachmentsEditModalOpen,
						size: "xs",
					}}
				/>,
			]}
			{...props}
		>
			<TicketAttachmentsActionBoxContent />
			<AttachmentsEditModal
				isOpen={attachmentsEditModalIsOpen}
				onClose={onAttachmentsEditModalClose}
				attachments={attachments}
			/>
			<AttachmentsAddModal
				isOpen={attachmentsAddModalIsOpen}
				onClose={onAttachmentsAddModalClose}
			/>
		</ActionBox>
	);
}

export default TicketAttachmentsActionBox;
