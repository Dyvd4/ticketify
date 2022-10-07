import { Editor, EditorProps, RichUtils } from "draft-js";
import InlineStyleButtons from "./InlineStyleButtons";

export type InlineStyle = "BOLD" | "ITALIC" | "UNDERLINE" | "CODE"

export type InlineStyleButtonMap = {
    [key in InlineStyle]: any
}

export const CONTENTSTATE = {
    EMPTY: "<p><br></p>"
}

type MyEditorProps = {
    actions: Array<InlineStyle>
    wrapperProps?: React.ComponentPropsWithRef<"div">
} & EditorProps

function MyEditor(props: MyEditorProps) {
    const {
        actions,
        wrapperProps: { className: wrapperClassName, ...restWrapperProps } = {}
    } = props;

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            props.onChange(newState)
            return "handled"
        }
        return "not-handled"
    }

    return (
        <div className={`flex flex-col gap-2 ${wrapperClassName}`}
            {...restWrapperProps}>
            <InlineStyleButtons
                editorState={props.editorState}
                onChange={newState => props.onChange(newState)}
                actions={actions}
            />
            <Editor
                {...props}
                handleKeyCommand={handleKeyCommand}
                handlePastedFiles={files => { console.log(files); return "handled" }}
                handleDroppedFiles={files => { console.log(files); return "handled" }}
            />
        </div>
    );
}

export default MyEditor;