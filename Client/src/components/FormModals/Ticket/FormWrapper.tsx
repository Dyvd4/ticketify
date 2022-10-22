import { ContainerProps, useDisclosure, useToast } from "@chakra-ui/react";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchEntity } from "src/api/entity";
import { mutateTicket } from "src/api/ticket";
import { getEmptyState } from "src/utils/draftJs";
import { getValidationErrorMap, ValidationErrorMap } from "src/utils/error";
import Form from "./Form";

type FormWrapperProps = ({
    variant?: "add"
    mountButtonRef: React.MutableRefObject<HTMLButtonElement | null>
} | {
    variant?: "edit"
    id: any
    mountButtonRef: React.MutableRefObject<HTMLButtonElement | null>
}) & ContainerProps

function FormWrapper(props: FormWrapperProps) {

    const { variant = "add", id } = props
    // state
    // -----
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [localTicketState, setLocalTicketState] = useState<any>();
    const [localInputState, setLocalInputState] = useState<any>();
    const [localEditorState, setLocalEditorState] = useState<any>();
    const [success, setSuccess] = useState(false);
    const [errorMap, setErrorMap] = useState<ValidationErrorMap | null>();
    const toast = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        props.mountButtonRef.current!.addEventListener("click", onOpen);
    });

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
            toast({
                title: "successfully saved ticket",
                status: "success"
            });
            // 🥵
            await queryClient.invalidateQueries(["ticket", String(ticketState.id)]);
            await queryClient.invalidateQueries(["ticket"]);
            if (variant === "edit") handleOnClose();
            setLocalTicketState({
                id: response.data.id
            });
            setLocalInputState({});
            setLocalEditorState({
                "description": getEmptyState(editorState["description"])
            });
            setSuccess(true);
        },
        onError: (error) => {
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

    const resetLocalState = () => {
        setLocalTicketState({});
        setLocalInputState({});
        setLocalEditorState({});
    }
    const handleOnClose = () => {
        resetLocalState();
        onClose();
    }

    const loading = [responsibleUsersLoading, prioritiesLoading, ticketFetchStatus === "fetching", mutation.isLoading].some(loading => loading);
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
            success={success}
            error={error}
            errorMap={errorMap || null}
            responsibleUsers={responsibleUsers?.items || []}
            priorities={priorities?.items || []}
        />
    );
}

export default FormWrapper;