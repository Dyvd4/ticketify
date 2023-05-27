import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Flex,
    Heading,
    List,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { removeEntity } from "src/api/entity";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import Modal from "src/components/Wrapper/Modal";
import TicketListItem from "../components/TicketListItem";

type ConnectedTicketsEditModalProps = {
    connectedToTickets: any[];
    connectedByTickets: any[];
    isOpen: boolean;
    onClose(...args: any[]): void;
};

function ConnectedTicketsEditModal({
    isOpen,
    connectedToTickets,
    connectedByTickets,
    ...props
}: ConnectedTicketsEditModalProps) {
    // state
    // -----
    const { isOpen: alertIsOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const [connectedTicketToRemove, setConnectedTicketToRemove] = useState<any>();

    const { id } = useParams();
    const queryClient = useQueryClient();
    const cancelRef = useRef<any>(null);
    const toast = useToast();

    // mutations
    // ---------
    const mutation = useMutation(
        () => {
            const connectedById = connectedTicketToRemove.isConnectedTo
                ? id
                : connectedTicketToRemove.id;

            const connectedToId = connectedTicketToRemove.isConnectedTo
                ? connectedTicketToRemove.id
                : id;
            return removeEntity({
                route: `ticketOnTicket/${connectedById}/${connectedToId}`,
            });
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["ticket", String(id)]);
                onAlertClose();
                const { connectedToTickets, connectedByTickets } = queryClient.getQueryData([
                    "ticket",
                    String(id),
                ]) as any;
                if (connectedToTickets.concat(connectedByTickets).length === 0) props.onClose();
                toast({
                    title: "successfully removed connection to ticket",
                    status: "success",
                });
            },
        }
    );

    const handleOpen = (connectedTicket) => {
        setConnectedTicketToRemove(connectedTicket);
        onAlertOpen();
    };

    return (
        <Modal isOpen={isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>EDIT connected tickets</ModalHeader>
                <ModalBody>
                    {connectedToTickets.length > 0 && (
                        <>
                            <Heading className="text-lg">Connected to:</Heading>
                            <List className="my-2 flex flex-col gap-2">
                                {connectedToTickets.map((connectedTicket) => (
                                    <Flex
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                        gap={2}
                                        key={connectedTicket.id}
                                    >
                                        <TicketListItem item={connectedTicket} />
                                        <TooltipIconButton
                                            variant="remove"
                                            iconButtonProps={{
                                                circle: true,
                                                onClick: () =>
                                                    handleOpen({
                                                        ...connectedTicket,
                                                        isConnectedTo: true,
                                                    }),
                                            }}
                                        />
                                    </Flex>
                                ))}
                            </List>
                        </>
                    )}
                    {connectedByTickets.length > 0 && (
                        <>
                            <Heading className="text-lg">Connected by:</Heading>
                            <List className="my-2 flex flex-col gap-2">
                                {connectedByTickets.map((connectedTicket) => (
                                    <Flex
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                        gap={2}
                                        key={connectedTicket.id}
                                    >
                                        <TicketListItem item={connectedTicket} />
                                        <TooltipIconButton
                                            variant="remove"
                                            iconButtonProps={{
                                                circle: true,
                                                onClick: () =>
                                                    handleOpen({
                                                        ...connectedTicket,
                                                        isConnectedTo: true,
                                                    }),
                                            }}
                                        />
                                    </Flex>
                                ))}
                            </List>
                        </>
                    )}
                    <AlertDialog
                        isOpen={alertIsOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onAlertClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    Delete connection between ticket
                                </AlertDialogHeader>
                                <AlertDialogBody>
                                    Are you sure? You can't undo this action afterwards.
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onAlertClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        isLoading={mutation.isLoading}
                                        colorScheme="red"
                                        onClick={() => mutation.mutate()}
                                        ml={3}
                                    >
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ConnectedTicketsEditModal;
