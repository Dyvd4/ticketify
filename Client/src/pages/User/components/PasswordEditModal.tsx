import { Button, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import { request } from "src/services/request";
import { getValidationErrorMap, ValidationErrorMap } from "src/utils/error";

type PasswordEditModalProps = {
    user: any
    isOpen: boolean
    onClose(...args: any): void
    onSuccess?(...args: any[]): void
}

function PasswordEditModal({ isOpen, user, ...props }: PasswordEditModalProps) {

    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
    const [passwordData, setPasswordData] = useState<any>({
        newPassword: "",
        repeatedNewPassword: ""
    });

    const mutation = useMutation(async () => {
        const response = await request().put(`user/newPassword`, passwordData);
        return response;
    }, {
        onSuccess: (response) => {
            if (props.onSuccess) props.onSuccess();
            handleClose();
        },
        onError: (error) => {
            const errorMap = getValidationErrorMap(error);
            setErrorMap(errorMap);
        }
    });

    const handleChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    }

    const handleClose = () => {
        setPasswordData({ newPassword: "", repeatedNewPassword: "" });
        setErrorMap(null);
        props.onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Edit password
                </ModalHeader>
                <ModalBody>
                    <FormControl errorMessage={errorMap?.Fieldless}>
                        <FormControl errorMessage={errorMap?.newPassword}>
                            <FormLabel>
                                new password
                            </FormLabel>
                            <Input
                                name="newPassword"
                                type={"password"}
                                value={passwordData.newPassword}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl errorMessage={errorMap?.repeatedNewPassword}>
                            <FormLabel>
                                repeat new password
                            </FormLabel>
                            <Input
                                name="repeatedNewPassword"
                                type={"password"}
                                value={passwordData.repeatedNewPassword}
                                onChange={handleChange}
                            />
                        </FormControl>
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

export default PasswordEditModal;