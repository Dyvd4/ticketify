import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { addEntity } from "src/api/entity";
import FileInput from "src/components/FileInput";
import LoadingRipple from "src/components/Loading/LoadingRipple";

type AttachmentsAddProps = {
    isOpen: boolean
    onClose(...args: any[]): void
}

function AttachmentsAddModal({ isOpen, onClose, ...props }: AttachmentsAddProps) {


    // state
    // -----
    const [files, setFiles] = useState<FileList | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const { id } = useParams();
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation(() => {
        const formData = new FormData();
        formData.append("id", String(id));
        if (!files) return Promise.reject("");
        Array.from(files).forEach(file => {
            formData.append("files", file);
        });
        return addEntity({
            route: "ticket/file",
            payload: formData
        });
    }, {
        onSuccess: () => {
            toast({
                title: "successfully added attachment",
                status: "success"
            });
            queryClient.invalidateQueries(["ticket", String(id)]);
            onClose();
        }
    });

    const handleSubmit = () => {
        if (!files) return setErrorMessage("files have to be selected");
        mutation.mutate();
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
                    ADD attachments
                </ModalHeader>
                <ModalBody>
                    <Box className="mt-2">
                        <FileInput
                            multiple
                            onChange={setFiles}
                        />
                        {errorMessage && <>
                            <div className="text-red-500">
                                {errorMessage}
                            </div>
                        </>}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button
                        mr={3}
                        onClick={handleSubmit}
                        colorScheme={"cyan"}>
                        Submit
                    </Button>
                    <Button onClick={onClose}>
                        Abort
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AttachmentsAddModal;