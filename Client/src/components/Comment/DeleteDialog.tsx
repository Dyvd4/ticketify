import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";
import { useRef } from "react";

type DeleteDialogProps = {
    isOpen: boolean;
    onClose(...args: any[]): void;
    onDelete(...args: any[]): void;
};

function DeleteDialog({ isOpen, ...props }: DeleteDialogProps) {
    const cancelRef = useRef<any>(null);

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={props.onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>Delete comment</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={props.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={props.onDelete} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}

export default DeleteDialog;
