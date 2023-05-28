import {
	Box,
	Button,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { ComponentPropsWithRef, PropsWithChildren, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchEntity } from "src/api/entity";
import { addPinnedTicket } from "src/api/pinned-ticket";
import AutoCompleter from "src/components/AutoCompleter";
import FormControl from "src/components/Wrapper/FormControl";
import Modal from "src/components/Wrapper/Modal";
import {
	getValidationErrorMap,
	ValidationErrorMap,
	ValidationErrorResponse,
} from "src/utils/error";

type _AddPinnedTicketModalProps = {
	isOpen: boolean;
	onClose(...args: any[]): void;
};
export type AddPinnedTicketModalProps = PropsWithChildren<_AddPinnedTicketModalProps> &
	Omit<ComponentPropsWithRef<"div">, keyof _AddPinnedTicketModalProps>;

function AddPinnedTicketModal({ className, ...props }: AddPinnedTicketModalProps) {
	const toast = useToast();
	const queryClient = useQueryClient();

	const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
	const [ticketToPin, setTicketToPin] = useState<any>(null);
	const [ticketToPinInputState, setTicketToPinInputState] = useState("");

	const ticketsToPinQuery = useQuery(["ticketsToPin"], () =>
		fetchEntity({
			route: "tickets-to-pin",
		})
	);

	const mutation = useMutation(() => addPinnedTicket(ticketToPin.id), {
		onSuccess: async () => {
			await queryClient.invalidateQueries(["pinnedTickets"]);
			await queryClient.invalidateQueries(["ticketsToPin"]);
			handleClose();
			toast({
				status: "success",
				title: "Successfully created pinned ticket",
			});
		},
		onError: (error: AxiosError<ValidationErrorResponse>) => {
			setErrorMap(getValidationErrorMap(error));
		},
	});

	const handleClose = () => {
		setTicketToPinInputState("");
		setTicketToPin(null);
		setErrorMap(null);
		props.onClose();
	};

	const handleTicketToConnectOnSelect = (ticket, inputValue) => {
		setTicketToPin(ticket);
		setTicketToPinInputState(inputValue);
	};

	const handleTicketToConnectOnDiscard = () => {
		setTicketToPin(null);
		setTicketToPinInputState("");
	};

	return (
		<Modal
			isLoading={ticketsToPinQuery.isLoading}
			closeOnOverlayClick={false}
			isOpen={props.isOpen}
			onClose={handleClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>Add pinned ticket</ModalHeader>
				<ModalBody>
					{!ticketsToPinQuery.isLoading && (
						<>
							<Box className="mt-2">
								<FormControl errorMessage={errorMap?.message}>
									<AutoCompleter
										items={ticketsToPinQuery.data.items}
										listItemRender={(ticket) => `#${ticket.id} ${ticket.title}`}
										inputValue={ticketToPinInputState}
										onChange={setTicketToPinInputState}
										onSelect={handleTicketToConnectOnSelect}
										onDiscard={handleTicketToConnectOnDiscard}
									/>
								</FormControl>
							</Box>
						</>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						isLoading={mutation.isLoading}
						mr={3}
						onClick={() => mutation.mutate()}
						colorScheme={"cyan"}
					>
						Submit
					</Button>
					<Button onClick={handleClose}>Abort</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default AddPinnedTicketModal;
