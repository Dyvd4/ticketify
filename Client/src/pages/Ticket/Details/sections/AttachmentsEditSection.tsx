import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
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
}

function AttachmentsEditSection({ attachments, ...props }: AttachmentsEditProps) {

    // state
    // -----
    const { isOpen, onOpen, onClose } = useDisclosure();
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
            onClose();
            toast({
                title: "successfully removed attachment",
                status: "success"
            });
            queryClient.invalidateQueries(["ticket", String(id)]);
        }
    });

    const handleOpen = (attachment) => {
        setAttachmentToRemove(attachment);
        onOpen();
    }

    if (mutation.isLoading) return <LoadingRipple centered />

    return (
        <>
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
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            Delete attachment
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
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
        </>
    );
}

export default AttachmentsEditSection;