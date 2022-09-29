import { Box, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { addEntity } from "src/api/entity";
import FileInput from "src/components/FileInput";
import LoadingRipple from "src/components/Loading/LoadingRipple";

type AttachmentsAddSectionProps = {}

function AttachmentsAddSection(props: AttachmentsAddSectionProps) {

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
            queryClient.invalidateQueries(["ticket", String(id)])
        }
    });

    const handleSubmit = () => {
        if (!files) return setErrorMessage("files have to be selected");
        mutation.mutate();
    }

    if (mutation.isLoading) return <LoadingRipple centered />

    return (
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
            <Box className="mt-2">
                <Button
                    onClick={handleSubmit}
                    colorScheme="blue"
                    size={"sm"}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

export default AttachmentsAddSection;