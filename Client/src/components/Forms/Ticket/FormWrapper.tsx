import { Container, ContainerProps, Heading, useToast } from "@chakra-ui/react";
import { faFireFlameCurved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { addEntity, fetchEntity, updateEntity } from "src/api/entity";
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
    // handler
    // -------
    const mutateTicket = async () => {
        if (variant === "add") {
            const formData = new FormData();
            // ugly as shit
            // ------------
            Object.keys(ticket || {}).forEach(key => {
                if (key !== "files") {
                    formData.append(key, ticket[key])
                }
            });
            Array.from(ticket?.files || []).forEach(file => {
                formData.append("files", file as File);
            });
            formData.append("description", stateToHTML(editorStates["description"].getCurrentContent()));
            return addEntity({
                route: "ticket",
                payload: formData,
                options: {
                    headers: {
                        "content-type": "multipart/form-data"
                    }
                }
            })
        }
        const ticketId = ticket.id;
        delete ticket.responsibleUser;
        delete ticket.priority;
        delete ticket.status;
        delete ticket.attachments;
        delete ticket.files;
        delete ticket.images;
        delete ticket.id;
        return updateEntity({
            route: "ticket",
            entityId: ticketId,
            payload: ticket
        });
    }
    // mutations
    // ---------
    const mutation = useMutation(mutateTicket, {
        onSuccess: (response) => {
            const errorMap = getValidationErrorMap({ response });
            setErrorMap(errorMap);
            if (!errorMap) {
                toast({
                    title: "successfully saved ticket",
                    status: "success"
                });
                // 🥵
                if (onSuccess) onSuccess();
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
            }
        }
    });
    // queries
    // -------

    // responsible user
    const {
        data: responsibleUsers,
        isLoading: responsibleUsersLoading,
        isError: responsibleUsersError
    }
        = useQuery(["responsibleUsers"], () => fetchEntity({ route: "users" }))
    // priority
    const {
        data: priorities,
        isLoading: prioritiesLoading,
        isError: prioritiesError
    }
        = useQuery(["priorities"], () => fetchEntity({ route: "ticketPriorities" }))

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
        <Container {...props}>
            <Heading as="h1" className="my-4 flex items-center gap-4">
                {variant} ticket
                <FontAwesomeIcon icon={faFireFlameCurved} className="text-orange-600" />
            </Heading>
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
        </Container>
    );
}

export default FormWrapper;