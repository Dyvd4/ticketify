import { Editor, EditorProps, EditorState, RichUtils } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useState } from "react";
import InlineStyleButtons from "./Private/InlineStyleButtons";

export type InlineStyle = "BOLD" | "ITALIC" | "UNDERLINE" | "CODE"

export type InlineStyleButton = {
    [key in InlineStyle]: any
}

type MyEditorProps = {
    actions: Array<InlineStyle>
    wrapperProps?: React.ComponentPropsWithRef<"div">
    onChange?(htmlOutput: string)
} & Omit<EditorProps, "editorState" | "onChange">

function MyEditor(props: MyEditorProps) {
    const {
        actions,
        wrapperProps: { className: wrapperClassName, ...restWrapperProps } = {}
    } = props;

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const handleChange = (newState) => {
        setEditorState(newState);
        if (props.onChange) props.onChange(stateToHTML(newState.getCurrentContent()))
    }
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }
        return "not-handled"
    }
    console.log(editorState);

    return (
        <div className={`flex flex-col gap-2 ${wrapperClassName}`}
            {...restWrapperProps}>
            <InlineStyleButtons
                editorState={editorState}
                onChange={(newState) => setEditorState(newState)}
                actions={actions}
            />
            <Editor
                {...props}
                editorState={editorState}
                onChange={handleChange}
                handleKeyCommand={handleKeyCommand}
            />
        </div>
    );
}

export default MyEditor;