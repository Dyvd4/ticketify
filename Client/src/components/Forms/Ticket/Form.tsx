import { Alert, Button, FormLabel, HStack, Input, Link, VStack } from "@chakra-ui/react"
import { EditorState } from "draft-js"
import AutoCompleter from "src/components/AutoCompleter/AutoCompleter"
import FileInput from "src/components/FileInput"
import LoadingRipple from "src/components/Loading/LoadingRipple"
import Editor from "src/components/RichText/Editor"
import FormControl from "src/components/Wrapper/FormControl"
import { mapLookup } from "src/utils/autoCompleter"
import { ValidationErrorMap } from "src/utils/error"

type TicketFormProps = {
    variant: "add" | "edit"
    loading: boolean
    error: boolean
    success: boolean
    responsibleUsers: any[]
    priorities: any[]
    // three different states 🥵
    ticket?: any
    input?: any
    editorStates: {
        [key: string]: EditorState
    }
    // -------------------------
    errorMap: ValidationErrorMap | null
    onInputChange(event): void
    onInputValueChange(event): void
    onEditorStateChange(key: string, editorState: EditorState): void
    onAbort?(...args: any[]): void
    onSubmit(...args: any[]): void
}

function TicketForm({ loading, success, error, errorMap, ticket, input, editorStates, ...props }: TicketFormProps) {

    if (loading) {
        // possible overlap with authorization LoadingRipple
        return <LoadingRipple centered />
    }

    if (error) {
        return (
            <Alert status="error">
                An unkown error occurred
            </Alert>
        )
    }

    return (
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
                        inputValue={input?.responsibleUserId}
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
                        inputValue={input?.priorityId}
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
            <HStack gap={2} className="mt-4">
                <Button
                    onClick={props.onAbort}
                    size="sm">
                    Abort
                </Button>
                <Button
                    onClick={props.onSubmit}
                    colorScheme="blue"
                    size={"sm"}>
                    Submit
                </Button>
                {success && props.variant !== "edit" && <>
                    <Link href={`/Ticket/Details/${ticket?.id}`}>
                        <Button size="sm">
                            Go to details
                        </Button>
                    </Link>
                </>}
            </HStack>
        </FormControl >
    );
}

export default TicketForm;