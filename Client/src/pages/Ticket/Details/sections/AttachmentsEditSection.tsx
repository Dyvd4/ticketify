import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, Heading, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import { removeEntity } from "src/api/entity";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import IconButton from "src/components/Wrapper/IconButton";
import Attachment from "../components/Attachment";

type AttachmentsEditProps = {
    ticketId: string
    attachments: any[]
    onRemoved(...args: any[]): void
    onDone(...args: any[]): void
}

function AttachmentsEditSection({ attachments, ticketId, ...props }: AttachmentsEditProps) {
    // state
    // -----
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [attachmentToRemove, setAttachmentToRemove] = useState<any>();

    const cancelRef = useRef<any>(null);
    const toast = useToast();

    // mutations
    // ---------
    const mutation = useMutation(() => {
        return removeEntity({
            route: `ticket/fileOnTicket/${ticketId}/${attachmentToRemove.id}`,
        })
    }, {
        onSuccess: () => {
            props.onRemoved();
            onClose();
            toast({
                title: "successfully removed attachment",
                status: "success"
            });
        }
    });

    const handleOpen = (attachment) => {
        setAttachmentToRemove(attachment);
        onOpen();
    }
    
    return (
        mutation.isLoading
            ? <LoadingRipple centered />
            : <Box className="my-2">
                <Heading as="h3" size="md" className="mb-2">
                    Edit attachments
                </Heading>
                <Flex direction={"column"} gap={2}>
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
                <Button
                    onClick={props.onDone}
                    size="sm"
                    className="mt-2"
                    colorScheme={"blue"}>
                    done
                </Button>
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
                                Are you sure you? You can't undo this action afterwards.
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
            </Box>
    );
}

export default AttachmentsEditSection;