import { Button, useToast } from "@chakra-ui/react";
import type EditorJS from "@editorjs/editorjs";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity, updateEntity } from "src/api/entity";
import ActionBox, { ActionBoxProps, ActionBoxSkeleton } from "src/components/ActionBox";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import Editor from "src/components/Editor";
import useToggle from "src/hooks/useToggle";
import { cn } from "src/utils/component";
import { getTitle } from "src/utils/ticket";
import PinTicketButton from "../PinTicketButton";
import WatchTicketButton from "../WatchTicketButton";

type _TicketDescriptionActionBoxProps = {};

export type TicketDescriptionActionBoxProps = _TicketDescriptionActionBoxProps &
	Omit<ActionBoxProps, keyof _TicketDescriptionActionBoxProps>;

function TicketDescriptionActionBox({ className, ...props }: TicketDescriptionActionBoxProps) {
	const { id } = useParams();
	const [isCollapsed, , toggleIsCollapsed] = useToggle(false);
	const [isEdit, , toggleIsEdit] = useToggle(false);
	const [editor, setEditor] = useState<EditorJS | null>(null);
	const [description, setDescription] = useState<string | null>(null);
	const toast = useToast();

	const mutation = useMutation(
		async () => {
			const description = JSON.stringify(await editor!.save());
			return updateEntity({
				route: "ticket",
				entityId: id,
				payload: {
					description,
				},
			});
		},
		{
			onSuccess: async () => {
				await refetch();
				toggleIsEdit();
				toast({ title: "successfully saved description", status: "info" });
			},
		}
	);

	const toggleEdit = () => {
		setDescription(ticket.description);
		toggleIsEdit();
	};

	// queries
	// -------
	const {
		isLoading: ticketLoading,
		isError: ticketError,
		data: ticket,
		refetch,
	} = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

	if (ticketLoading) return <ActionBoxSkeleton />;

	return (
		<ActionBox
			useCollapse
			isCollapsed={isCollapsed}
			toggleIsCollapsed={toggleIsCollapsed}
			className={cn("", className)}
			title={getTitle(ticket)}
			actions={[
				<TooltipIconButton
					variant="edit"
					tooltipProps={{
						label: "edit description",
					}}
					iconButtonProps={{
						onClick: () => toggleEdit(),
						size: "sm",
					}}
				/>,
				<PinTicketButton />,
				<WatchTicketButton />,
			]}
			menuButtonSize={"sm"}
			{...props}
		>
			{!isEdit && (
				<>
					<Editor
						className="border-0"
						isReadOnly={!isEdit}
						data={ticket.description && JSON.parse(ticket.description)}
						onMount={(e) => setEditor(e)}
					/>
				</>
			)}
			{isEdit && (
				<>
					<Editor
						className="border-0"
						isReadOnly={!isEdit}
						data={description && JSON.parse(description)}
						onMount={(e) => setEditor(e)}
					/>
					<div className="flex justify-end gap-4">
						<Button onClick={toggleEdit}>Cancel</Button>
						<Button
							isLoading={mutation.isLoading}
							colorScheme={"blue"}
							onClick={() => mutation.mutate()}
						>
							Submit
						</Button>
					</div>
				</>
			)}
		</ActionBox>
	);
}

export default TicketDescriptionActionBox;
