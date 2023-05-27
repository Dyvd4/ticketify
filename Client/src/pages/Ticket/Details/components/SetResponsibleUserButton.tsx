import {
    Button,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity, updateEntity } from "src/api/entity";
import AutoCompleter from "src/components/AutoCompleter";
import Modal from "src/components/Wrapper/Modal";

type SetResponsibleUserButtonProps = {};

function SetResponsibleUserButton(props: SetResponsibleUserButtonProps) {
    // state
    // -----
    const [responsibleUser, setResponsibleUser] = useState<any>(null);
    const [responsibleUserInputState, setResponsibleUserInputState] = useState("");

    // hooks
    // -----
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { id } = useParams();
    const toast = useToast();
    const queryClient = useQueryClient();

    // queries
    // -------
    const { data: responsibleUsers, isLoading: responsibleUsersLoading } = useQuery(
        ["responsibleUsers"],
        () => fetchEntity({ route: "users" })
    );

    const { data, isLoading: ticketIsLoading } = useQuery(["ticket", id?.toString()]);

    const ticket = data as any;

    // mutations
    // ---------
    const mutation = useMutation(
        () =>
            updateEntity({
                route: "ticket",
                entityId: id,
                payload: { responsibleUserId: responsibleUser?.id || null },
            }),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["ticket", String(id)]);
                onClose();
                toast({
                    status: "success",
                    title: "successfully changed responsible user",
                });
            },
        }
    );

    useEffect(() => {
        setResponsibleUser(ticket.responsibleUser);
        setResponsibleUserInputState(ticket.responsibleUser?.username);
    }, [ticket]);

    const isLoading = responsibleUsersLoading || ticketIsLoading;

    return (
        <>
            <Modal isLoading={isLoading} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change the responsible user</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {!isLoading && (
                            <>
                                <AutoCompleter
                                    items={responsibleUsers?.items || []}
                                    listItemRender={(user) => user.username}
                                    inputValue={responsibleUserInputState}
                                    onChange={setResponsibleUserInputState}
                                    onSelect={(user, inputValue) => {
                                        setResponsibleUserInputState(inputValue);
                                        setResponsibleUser(user);
                                    }}
                                    onDiscard={() => {
                                        setResponsibleUserInputState("");
                                        setResponsibleUser(null);
                                    }}
                                />
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isLoading={mutation.isLoading}
                            mr={3}
                            colorScheme={"cyan"}
                            onClick={() => mutation.mutate()}
                        >
                            confirm
                        </Button>
                        <Button onClick={onClose}>cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button
                isLoading={mutation.isLoading}
                size={"sm"}
                onClick={onOpen}
                leftIcon={<FontAwesomeIcon icon={faUser} />}
            >
                set responsible user
            </Button>
        </>
    );
}

export default SetResponsibleUserButton;
