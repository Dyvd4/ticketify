import { Box, Button, Heading, HStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { addEntity } from "src/api/entity";
import FileInput from "src/components/FileInput";
import LoadingRipple from "src/components/Loading/LoadingRipple";

type AttachmentsAddSectionProps = {
    ticketId: string
    onSuccess(...args: any[]): void
    onAbort(...args: any[]): void
}

function AttachmentsAddSection({ ticketId, ...props }: AttachmentsAddSectionProps) {
    // state
    // -----
    const [files, setFiles] = useState<FileList | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const toast = useToast();

    const handleSubmit = () => {
        if (!files) return setErrorMessage("files have to be selected");
        mutation.mutate();
    }

    const mutation = useMutation(() => {
        const formData = new FormData();
        formData.append("id", ticketId);
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
            props.onSuccess();
            toast({
                title: "successfully added attachment",
                status: "success"
            });
        }
    });

    return (
        mutation.isLoading
            ? <LoadingRipple centered />
            : <Box className="my-2">
                <Heading as="h3" size="md" className="mb-2">
                    Add attachments
                </Heading>
                <FileInput
                    multiple
                    onChange={setFiles}
                />
                {errorMessage && <>
                    <div className="text-red-500">
                        {errorMessage}
                    </div>
                </>}
                <HStack className="mt-4 gap-2">
                    <Button
                        onClick={props.onAbort}
                        size={"sm"}>
                        Abort
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        colorScheme="blue"
                        size={"sm"}>
                        Submit
                    </Button>
                </HStack>
            </Box>
    );
}

export default AttachmentsAddSection;