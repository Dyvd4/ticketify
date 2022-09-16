import { Button, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useState } from "react"
import { useMutation } from "react-query"
import FormControl from "src/components/Wrapper/FormControl"
import { request } from "src/services/request"
import { getValidationErrorMap, ValidationErrorMap } from "src/utils/error"

type UsernameEditModalProps = {
    user: any
    isOpen: boolean
    onClose(...args: any): void
    onSuccess?(...args: any[]): void
}

function UsernameEditModal({ user, isOpen, ...props }: UsernameEditModalProps) {

    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
    const [username, setUsername] = useState<any>(user.username);

    const mutation = useMutation(async () => {
        const response = await request().put(`user`, {
            username
        });
        return response;
    }, {
        onSuccess: (response) => {
            if (props.onSuccess) props.onSuccess();
            handleClose(response);
        },
        onError: (error) => {
            const errorMap = getValidationErrorMap(error);
            setErrorMap(errorMap);
        }
    });

    const handleClose = (response?) => {
        setUsername(response?.data?.username || user.username);
        setErrorMap(null);
        props.onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Edit username
                </ModalHeader>
                <ModalBody>
                    <FormControl errorMessage={errorMap?.username}>
                        <FormLabel>
                            username
                        </FormLabel>
                        <Input
                            name="username"
                            type={"text"}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        colorScheme={"blue"}
                        onClick={() => mutation.mutate()}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default UsernameEditModal;