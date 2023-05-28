import {
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
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { addEntity, fetchEntity } from "src/api/entity";
import AutoCompleter from "src/components/AutoCompleter";
import FormControl from "src/components/Wrapper/FormControl";
import Modal from "src/components/Wrapper/Modal";
import {
	getValidationErrorMap,
	ValidationErrorMap,
	ValidationErrorResponse,
} from "src/utils/error";

type ConnectedTicketsAddModalProps = {
	connectedToTickets: any[];
	connectedByTickets: any[];
	isOpen: boolean;
	onClose(...args: any[]): void;
};

function ConnectedTicketsAddModal({
	isOpen,
	connectedToTickets,
	connectedByTickets,
	...props
}: ConnectedTicketsAddModalProps) {
	// state
	// -----
	const [ticketToConnect, setTicketToConnect] = useState<any>(null);
	const [ticketToConnectInputState, setTicketToConnectInputState] = useState("");
	const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();

	// hooks
	// -----
	const { id } = useParams();
	const queryClient = useQueryClient();
	const toast = useToast();

	// queries
	// -------
	const { data: tickets, isLoading: ticketsAreLoading } = useQuery(
		["ticketsToConnect", id],
		async () => {
			const response = await fetchEntity({
				route: "tickets",
				queryParams: {
					excludeIds: [
						id,
						...connectedToTickets.concat(connectedByTickets).map((ticket) => ticket.id),
					],
				},
			});
			return response.items;
		}
	);

	const { data, isLoading: ticketIsLoading } = useQuery(["ticket", id?.toString()]);

	const ticket = data as any;

	const mutation = useMutation(
		() => {
			return addEntity({
				route: "ticketOnTicket",
				payload: {
					connectedByTicketId: ticket.id,
					connectedToTicketId: ticketToConnect.id,
				},
			});
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(["ticket", String(id)]);
				handleClose();
				toast({
					title: "successfully added connection to ticket",
					status: "success",
				});
			},
			onError: (error: AxiosError<ValidationErrorResponse>) => {
				const errorMap = getValidationErrorMap(error);
				setErrorMap(errorMap);
			},
		}
	);

	const handleClose = () => {
		setTicketToConnectInputState("");
		setTicketToConnect(null);
		setErrorMap(null);
		props.onClose();
	};

	const handleTicketToConnectOnSelect = (ticket, inputValue) => {
		setTicketToConnect(ticket);
		setTicketToConnectInputState(inputValue);
	};

	const handleTicketToConnectOnDiscard = () => {
		setTicketToConnect(null);
		setTicketToConnectInputState("");
	};

	const isLoading = ticketIsLoading || ticketsAreLoading;

	return (
		<Modal isLoading={isLoading} isOpen={isOpen} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>ADD connection to other ticket</ModalHeader>
				<ModalBody>
					{!isLoading && (
						<>
							<FormControl errorMessage={errorMap?.message}>
								<AutoCompleter
									items={tickets}
									listItemRender={(ticket) => `#${ticket.id} ${ticket.title}`}
									inputValue={ticketToConnectInputState}
									onChange={setTicketToConnectInputState}
									onSelect={handleTicketToConnectOnSelect}
									onDiscard={handleTicketToConnectOnDiscard}
								/>
							</FormControl>
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
					<Button onClick={handleClose}>Cancel</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default ConnectedTicketsAddModal;
