import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { removeEntity } from "src/api/entity";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import IconButton from "src/components/Wrapper/IconButton";
import Attachment from "../components/Attachment";

type AttachmentsEditProps = {
    attachments: any[]
    isOpen: boolean
    onClose(...args: any[]): void
}

function AttachmentsEditModal({ attachments, isOpen, onClose, ...props }: AttachmentsEditProps) {

    // state
    // -----
    const { isOpen: alertIsOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

    const [attachmentToRemove, setAttachmentToRemove] = useState<any>();

    const { id } = useParams();
    const queryClient = useQueryClient();
    const cancelRef = useRef<any>(null);
    const toast = useToast();

    // mutations
    // ---------
    const mutation = useMutation(() => {
        return removeEntity({
            route: `ticket/fileOnTicket/${id}/${attachmentToRemove.id}`,
        })
    }, {
        onSuccess: () => {
            onAlertClose();
            toast({
                title: "successfully removed attachment",
                status: "success"
            });
            queryClient.invalidateQueries(["ticket", String(id)]);
        }
    });

    const handleOpen = (attachment) => {
        setAttachmentToRemove(attachment);
        onAlertOpen();
    }

    if (mutation.isLoading) return <LoadingRipple centered />

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    EDIT attachments
                </ModalHeader>
                <ModalBody>
                    <Flex
                        className="my-2"
                        direction={"column"}
                        gap={2}>
                        {attachments.map(attachment => (
                            <Flex
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                gap={2}
                                key={attachment.id}>
                                <Attachment attachment={attachment} />
                                <Tooltip label="remove" placement="top">
                                    <IconButton
                                        circle
                                        size={"sm"}
                                        onClick={() => handleOpen(attachment)}
                                        aria-label="remove"
                                        icon={<FontAwesomeIcon icon={faRemove} />}
                                    />
                                </Tooltip>
                            </Flex>
                        ))}
                    </Flex>
                    <AlertDialog
                        isOpen={alertIsOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onAlertClose}>
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    Delete attachment
                                </AlertDialogHeader>
                                <AlertDialogBody>
                                    Are you sure? You can't undo this action afterwards.
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onAlertClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={() => mutation.mutate()}
                                        ml={3} >
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={onClose}
                        colorScheme={"cyan"}>
                        Done
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AttachmentsEditModal;