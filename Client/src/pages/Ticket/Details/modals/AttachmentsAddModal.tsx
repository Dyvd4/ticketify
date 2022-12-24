import { Alert, AlertIcon, Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { addEntity } from "src/api/entity";
import FileInput from "src/components/FileInput";

const VALID_IMAGETYPES_REGEX = import.meta.env.VITE_VALID_IMAGETYPES_REGEX;

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
        onSuccess: async () => {
            await queryClient.invalidateQueries(["ticket/attachments", String(id)]);
            handleClose();
            toast({
                title: "successfully added attachment",
                status: "success"
            });
        }
    });

    const handleSubmit = () => {
        if (!files) return setErrorMessage("files have to be selected");
        mutation.mutate();
    }

    const handleClose = () => {
        setFiles(null);
        setErrorMessage("");
        onClose();
    }

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={handleClose}>
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
                            <div className="text-red-500 m-1">
                                {errorMessage}
                            </div>
                        </>}
                    </Box>
                    <Alert status="info" className="mt-4 rounded-md">
                        <AlertIcon />
                        Attachments whose file extension match the following regex will be considered as images: {VALID_IMAGETYPES_REGEX}
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={mutation.isLoading}
                        mr={3}
                        onClick={handleSubmit}
                        colorScheme={"cyan"}>
                        Submit
                    </Button>
                    <Button onClick={handleClose}>
                        Abort
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AttachmentsAddModal;