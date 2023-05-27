import {
    Box,
    Button,
    Link,
    Modal as ChakraModal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalProps as ChakraModalProps,
    useBoolean,
} from "@chakra-ui/react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingRipple from "../Loading/LoadingRipple";

type ModalProps = {
    isLoading?: boolean;
    isError?: boolean;
} & ChakraModalProps;

function Modal({ isLoading, isError, children, ...props }: ModalProps) {
    const [isOpen, setIsOpen] = useBoolean(true);

    if (isLoading) return <LoadingRipple usePortal />;

    if (isError)
        return (
            <ChakraModal isOpen={isOpen} onClose={setIsOpen.off}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>
                        <Box className="flex items-center gap-4">
                            <FontAwesomeIcon
                                className="text-red-500"
                                icon={faCircleExclamation}
                                size={"2x"}
                            />
                            An unkown error occurred
                        </Box>
                    </ModalHeader>
                    <ModalBody>
                        We're sorry that this happened to you. <br />
                        The error is logged. <br />
                        Please contact your system admin to check the error.
                    </ModalBody>
                    <ModalFooter>
                        <Link href="/Log">
                            <Button mr={3} colorScheme={"cyan"}>
                                View logs
                            </Button>
                        </Link>
                        <Button onClick={setIsOpen.off}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </ChakraModal>
        );

    return <ChakraModal {...props}>{children}</ChakraModal>;
}

export default Modal;
