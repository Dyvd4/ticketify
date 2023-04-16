import { ContainerProps, useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchEntity } from "src/api/entity";
import { mutateTicket } from "src/api/ticket";
import { getEmptyState } from "src/utils/draftJs";
import { getValidationErrorMap, ValidationErrorMap, ValidationErrorResponse } from "src/utils/error";
import Form from "./Form";

type FormWrapperProps = ({
    variant?: "add"
    isOpen: boolean
    onClose(...args: any[]): void
} | {
    variant?: "edit"
    id: any
    isOpen: boolean
    onClose(...args: any[]): void
}) & ContainerProps

function FormWrapper(props: FormWrapperProps) {

    const { variant = "add", id, isOpen, onClose } = props
    // state
    // -----
    const [localTicketState, setLocalTicketState] = useState<any>({});
    const [localInputState, setLocalInputState] = useState<any>({});
    const [localEditorState, setLocalEditorState] = useState<any>({});
    const [success, setSuccess] = useState(false);
    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
    const toast = useToast();
    const queryClient = useQueryClient();

    // queries
    // -------
    const { data: fetchedTicket = {}, fetchStatus: ticketFetchStatus } = useQuery(["ticket", id], () => {
        return fetchEntity({ route: "ticket", entityId: id!.toString() })
    }, {
        enabled: !!id && isOpen,
        refetchOnWindowFocus: false
    });

    const {
        data: responsibleUsers,
        isLoading: responsibleUsersLoading,
        isError: responsibleUsersError
    } = useQuery(["responsibleUsers"], () => fetchEntity({ route: "users" }))

    const {
        data: priorities,
        isLoading: prioritiesLoading,
        isError: prioritiesError
    } = useQuery(["priorities"], () => fetchEntity({ route: "ticketPriorities" }))

    const defaultInputState = {
        "responsibleUserId": fetchedTicket?.responsibleUser?.username,
        "priorityId": fetchedTicket?.priority?.name
    }
    const defaultEditorState = {
        description: !fetchedTicket
            ? EditorState.createEmpty()
            : EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(fetchedTicket.description || "").contentBlocks
                )
            )
    }
    const ticketState = {
        ...fetchedTicket,
        // FIXME: wrong format
        dueDate: new Date(!!fetchedTicket && fetchedTicket.dueDate
            ? new Date(fetchedTicket.dueDate)
            : new Date()),
        ...localTicketState
    }
    const inputState = {
        ...defaultInputState,
        ...localInputState
    }
    const editorState = {
        ...defaultEditorState,
        ...localEditorState
    }
    // mutations
    // ---------
    const mutation = useMutation(() => {
        return mutateTicket({
            ...ticketState,
            description: stateToHTML(editorState["description"].getCurrentContent())
        }, variant)
    }, {
        onSuccess: async (response) => {
            await queryClient.invalidateQueries(["ticket", String(ticketState.id)]);
            await queryClient.invalidateQueries(["ticket"]);
            toast({
                title: "successfully saved ticket",
                status: "success"
            });
            if (variant === "add") {
                setLocalTicketState({
                    id: response.data.id
                });
                setLocalInputState({});
                setErrorMap(null);
                setLocalEditorState({
                    "description": EditorState.createEmpty()
                });
                setSuccess(true);
            } else {
                handleOnClose()
            }
        },
        onError: (error: AxiosError<ValidationErrorResponse>) => {
            const errorMap = getValidationErrorMap(error);
            setErrorMap(errorMap);
        }
    });
    // handler
    // -------
    const handleInputChange = ([key, value]) => {
        setLocalTicketState(ticket => {
            return {
                ...ticket,
                [key]: value
            }
        });
    }

    const handleInputValueChange = ([key, value]) => {
        setLocalInputState(input => {
            return {
                ...input,
                [key]: value
            }
        });
    }

    const handleOnClose = () => {
        setLocalTicketState({});
        setLocalInputState({});
        setLocalEditorState({});
        onClose();
    }

    const loading = [responsibleUsersLoading, prioritiesLoading, ticketFetchStatus === "fetching"].some(loading => loading);
    const error = [responsibleUsersError, prioritiesError].some(error => error);

    return (
        <Form
            variant={variant}
            modalIsOpen={isOpen}
            onAbort={handleOnClose}
            onSubmit={() => mutation.mutate()}
            onInputChange={handleInputChange}
            onInputValueChange={handleInputValueChange}
            onEditorStateChange={(key, newState) => {
                setLocalEditorState({ ...localEditorState, [key]: newState })
            }}
            ticketState={ticketState}
            inputState={inputState}
            editorState={editorState}
            loading={loading}
            mutationLoading={mutation.isLoading}
            success={success}
            error={error}
            errorMap={errorMap || null}
            responsibleUsers={responsibleUsers?.items || []}
            priorities={priorities?.items || []}
        />
    );
}

export default FormWrapper;