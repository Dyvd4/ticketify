import {
    Button,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import FormControl from "src/components/Wrapper/FormControl";
import { request } from "src/services/request";
import {
    getValidationErrorMap,
    ValidationErrorMap,
    ValidationErrorResponse,
} from "src/utils/error";

type PasswordEditModalProps = {
    user: any;
    isOpen: boolean;
    onClose(...args: any): void;
    onSuccess?(...args: any[]): void;
};

function PasswordEditModal({ isOpen, user, ...props }: PasswordEditModalProps) {
    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>(null);
    const [passwordData, setPasswordData] = useState<any>({
        currentPassword: "",
        newPassword: "",
        repeatedNewPassword: "",
    });

    const mutation = useMutation(
        async () => {
            const response = await request().put(`user/newPassword`, passwordData);
            return response;
        },
        {
            onSuccess: (response) => {
                if (props.onSuccess) props.onSuccess();
                handleClose();
            },
            onError: (error: AxiosError<ValidationErrorResponse>) => {
                const errorMap = getValidationErrorMap(error);
                setErrorMap(errorMap);
            },
        }
    );

    const handleChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleClose = () => {
        setPasswordData({ newPassword: "", repeatedNewPassword: "" });
        setErrorMap(null);
        props.onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit password</ModalHeader>
                <ModalBody>
                    <FormControl errorMessage={errorMap?.message}>
                        <FormControl errorMessage={errorMap?.currentPassword}>
                            <FormLabel>Current password</FormLabel>
                            <Input
                                name="currentPassword"
                                type={"password"}
                                value={passwordData.currentPassword}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl errorMessage={errorMap?.newPassword} className="mt-2">
                            <FormLabel>New password</FormLabel>
                            <Input
                                name="newPassword"
                                type={"password"}
                                value={passwordData.newPassword}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl errorMessage={errorMap?.repeatedNewPassword} className="mt-2">
                            <FormLabel>Repeat new password</FormLabel>
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
                    <Button
                        isLoading={mutation.isLoading}
                        mr={3}
                        colorScheme={"blue"}
                        onClick={() => mutation.mutate()}
                    >
                        Save
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default PasswordEditModal;
