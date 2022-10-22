import { Button, FormLabel, Input, Link, Modal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react"
import { EditorState } from "draft-js"
import AutoCompleter from "src/components/AutoCompleter/AutoCompleter"
import FileInput from "src/components/FileInput"
import Editor from "src/components/RichText/Editor"
import FormControl from "src/components/Wrapper/FormControl"
import ModalBody from "src/components/Wrapper/ModalBody"
import { mapLookup } from "src/utils/autoCompleter"
import { ValidationErrorMap } from "src/utils/error"

type TicketFormProps = {
    modalIsOpen: boolean
    variant: "add" | "edit"
    loading: boolean
    error: boolean
    success: boolean
    responsibleUsers: any[]
    priorities: any[]
    // three different states 🥵
    ticketState?: any
    inputState?: any
    editorState: {
        [key: string]: EditorState
    }
    // -------------------------
    errorMap: ValidationErrorMap | null
    onInputChange(event): void
    onInputValueChange(event): void
    onEditorStateChange(key: string, editorState: EditorState): void
    onAbort(...args: any[]): void
    onSubmit(...args: any[]): void
}

function TicketForm(props: TicketFormProps) {

    const {
        loading,
        success,
        error,
        errorMap,
        ticketState: ticket,
        inputState,
        editorState: editorStates,
        modalIsOpen
    } = props;

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={modalIsOpen}
            onClose={props.onAbort}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    {props.variant.toUpperCase()} ticket
                </ModalHeader>
                <ModalBody isLoading={loading} isError={error}>
                    <FormControl errorMessage={errorMap?.Fieldless}>
                        <VStack gap={2}>
                            <FormControl errorMessage={errorMap?.title}>
                                <FormLabel>
                                    title
                                </FormLabel>
                                <Input
                                    onChange={(e) => props.onInputChange(["title", e.target.value])}
                                    name="title"
                                    value={ticket?.title || ""}
                                />
                            </FormControl>
                            <FormControl errorMessage={errorMap?.responsibleUserId}>
                                <FormLabel>
                                    responsible user
                                </FormLabel>
                                <AutoCompleter
                                    items={props.responsibleUsers}
                                    listItemRender={item => item.username}
                                    inputValue={inputState?.responsibleUserId}
                                    onChange={(inputValue) => {
                                        props.onInputValueChange(["responsibleUserId", inputValue])
                                    }}
                                    onSelect={(item, inputValue) => {
                                        props.onInputValueChange(["responsibleUserId", inputValue])
                                        props.onInputChange(["responsibleUserId", item.id])
                                    }}
                                    onDiscard={() => {
                                        props.onInputValueChange(["responsibleUserId", null])
                                        props.onInputChange(["responsibleUserId", null]);
                                    }}
                                />
                            </FormControl>
                            <FormControl errorMessage={errorMap?.description}>
                                <FormLabel>
                                    description
                                </FormLabel>
                                <Editor
                                    editorState={editorStates["description"]}
                                    onChange={(newState) => props.onEditorStateChange("description", newState)}
                                    actions={["BOLD", "UNDERLINE", "ITALIC", "CODE"]}
                                />
                            </FormControl>
                            <FormControl errorMessage={errorMap?.dueDate}>
                                <FormLabel>
                                    due date
                                </FormLabel>
                                <Input
                                    type="datetime-local"
                                    onChange={(e) => props.onInputChange(["dueDate", e.target.value])}
                                    name="dueDate"
                                    value={ticket?.dueDate?.replace("Z", "") || new Date()}
                                />
                            </FormControl>
                            <FormControl errorMessage={errorMap?.priorityId}>
                                <FormLabel>
                                    priority
                                </FormLabel>
                                <AutoCompleter
                                    items={props.priorities}
                                    listItemRender={item => mapLookup(item)}
                                    inputValue={inputState?.priorityId}
                                    onChange={(inputValue) => {
                                        props.onInputValueChange(["priorityId", inputValue])
                                    }}
                                    onSelect={(item, inputValue) => {
                                        props.onInputValueChange(["priorityId", inputValue])
                                        props.onInputChange(["priorityId", item.id]);
                                    }}
                                    onDiscard={() => {
                                        props.onInputValueChange(["priorityId", null])
                                        props.onInputChange(["priorityId", null]);
                                    }}
                                />
                            </FormControl>
                            {props.variant === "add" && <>
                                <FormControl>
                                    <FormLabel>
                                        attachments
                                    </FormLabel>
                                    <FileInput
                                        multiple
                                        onChange={fileList => props.onInputChange(["files", fileList])}
                                    />
                                </FormControl>
                            </>}
                        </VStack>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    {success && props.variant !== "edit" && <>
                        <Link href={`/Ticket/Details/${ticket?.id}`}>
                            <Button mr={3}>
                                Go to details
                            </Button>
                        </Link>
                    </>}
                    <Button
                        mr={3}
                        colorScheme={"cyan"}
                        onClick={props.onSubmit}>
                        {props.variant === "add" ? "Submit" : "Save"}
                    </Button>
                    <Button onClick={props.onAbort}>
                        Abort
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default TicketForm;