import { ContainerProps, useToast } from "@chakra-ui/react";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchEntity } from "src/api/entity";
import { mutateTicket } from "src/api/ticket";
import { getEmptyState } from "src/utils/draftJs";
import { getValidationErrorMap, ValidationErrorMap } from "src/utils/error";
import Form from "./Form";


type FormWrapperProps = {
    ticket: any
    setTicket(...args: any[]): void
    variant?: "add" | "edit"
    onAbort?(...args: any[]): void
    onSuccess?(...args: any[]): void
} & ContainerProps

function FormWrapper(props: FormWrapperProps) {
    const { variant = "add", ticket, setTicket, onAbort, onSuccess } = props
    // state
    // -----
    const [input, setInput] = useState<any>(() => ({
        // not happy with this
        // bc of 2 different states
        "responsibleUserId": ticket?.responsibleUser?.username,
        "priorityId": ticket?.priority.name
    }));
    const [editorStates, setEditorStates] = useState(() => (
        {
            description: variant === "add"
                ? EditorState.createEmpty()
                : EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        convertFromHTML(ticket?.description || "").contentBlocks
                    )
                )
        }
    ));
    const [success, setSuccess] = useState(false);
    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
    const toast = useToast();
    const queryClient = useQueryClient();

    // mutations
    // ---------
    const mutation = useMutation(() => {
        return mutateTicket({
            ...ticket,
            description: stateToHTML(editorStates["description"].getCurrentContent())
        }, variant)
    }, {
        onSuccess: async (response) => {
            toast({
                title: "successfully saved ticket",
                status: "success"
            });
            // 🥵
            if (onSuccess) onSuccess();
            await queryClient.invalidateQueries(["ticket", String(ticket.id)]);
            if (variant === "edit") return;
            setTicket({
                ...{},
                id: response.data.id
            });
            setInput(null);
            setEditorStates({
                ...editorStates,
                "description": getEmptyState(editorStates["description"])
            });
            setSuccess(true);
        },
        onError: (error) => {
            const errorMap = getValidationErrorMap(error);
            setErrorMap(errorMap);
        }
    });

    // queries
    // -------
    const {
        data: responsibleUsers,
        isLoading: responsibleUsersLoading,
        isError: responsibleUsersError
    }
        = useQuery(["responsibleUsers"], () => fetchEntity({ route: "users" }))

    const {
        data: priorities,
        isLoading: prioritiesLoading,
        isError: prioritiesError
    }
        = useQuery(["priorities"], () => fetchEntity({ route: "ticketPriorities" }))

    // handler
    // -------
    const handleInputChange = ([key, value]) => {
        setTicket(ticket => {
            return {
                ...ticket,
                [key]: value
            }
        });
    }

    const handleInputValueChange = ([key, value]) => {
        setInput(input => {
            return {
                ...input,
                [key]: value
            }
        });
    }

    const loading = [responsibleUsersLoading, prioritiesLoading, mutation.isLoading].some(loading => loading);
    const error = [responsibleUsersError, prioritiesError].some(error => error);

    return (
        <Form
            variant={variant}
            onAbort={(e) => onAbort && onAbort(e)}
            onSubmit={() => mutation.mutate()}
            onInputChange={handleInputChange}
            onInputValueChange={handleInputValueChange}
            onEditorStateChange={(key, newState) => {
                setEditorStates({ ...editorStates, [key]: newState })
            }}
            ticket={ticket}
            input={input}
            editorStates={editorStates}
            loading={loading}
            success={success}
            error={error}
            errorMap={errorMap || null}
            responsibleUsers={responsibleUsers?.items || []}
            priorities={priorities?.items || []}
        />
    );
}

export default FormWrapper;