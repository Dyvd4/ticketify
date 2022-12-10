import { Button, Menu, MenuItemOption, MenuList, MenuOptionGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity, updateEntity } from "src/api/entity";
import Circle from "src/components/Circle";
import MenuButton from "src/components/Wrapper/MenuButton";

type SetStatusButtonProps = {}

function SetStatusButton(props: SetStatusButtonProps) {

    // state
    // -----
    const [status, setStatus] = useState<any>(null);

    // hooks
    // -----
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { id } = useParams();
    const toast = useToast();
    const queryClient = useQueryClient();

    // queries
    // -------
    const { data: ticketStatusResponse, isLoading: ticketStatusIsLoading } = useQuery(["ticketStatus"], () => fetchEntity({ route: "ticketStatuses" }));
    const { data, isLoading: ticketIsLoading } = useQuery(["ticket", id?.toString()]);

    const ticket = data as any;

    // mutations
    // ---------
    const mutation = useMutation(() => updateEntity({
        route: "ticket",
        entityId: id,
        payload: { statusId: status.id }
    }), {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["ticket", String(id)]);
            handleOnClose(true);
            toast({
                status: "success",
                title: "successfully changed status"
            });
        }
    });

    useEffect(() => {
        if (ticket) setStatus(ticket.status);
    }, [ticket]);


    const handleStatusChange = (statusId) => {
        setStatus(ticketStatusResponse.items.find(status => status.id === statusId));
        onOpen();
    }

    const handleOnClose = (isSuccess: boolean) => {
        if (!isSuccess) setStatus(ticket.status);
        onClose();
    }

    const isLoading = ticketIsLoading || ticketStatusIsLoading;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => handleOnClose(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Are you sure?
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        This will set the status to "{status?.name}".
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isLoading={mutation.isLoading}
                            mr={3}
                            colorScheme={"cyan"}
                            onClick={() => mutation.mutate()}>
                            confirm
                        </Button>
                        <Button onClick={() => handleOnClose(false)}>
                            cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Menu>
                <MenuButton
                    height={"8"}
                    className="text-sm"
                    as={Button}>
                    <FontAwesomeIcon icon={faSignal} className="mr-2" />
                    set status
                </MenuButton>
                {!isLoading && <>
                    <MenuList>
                        <MenuOptionGroup
                            onChange={handleStatusChange}
                            value={status.id}
                            type="radio">
                            {ticketStatusResponse.items
                                .sort((a, b) => a.priority - b.priority)
                                .map((status) => (
                                    <MenuItemOption
                                        key={status.id}
                                        value={status.id}>
                                        <span className="mr-2">
                                            {status.name}
                                        </span>
                                        <Circle
                                            className="inline float-right"
                                            bgColor={status.color}
                                        />
                                    </MenuItemOption>
                                ))}
                        </MenuOptionGroup>
                    </MenuList>
                </>}
            </Menu>
        </>
    );
}

export default SetStatusButton;