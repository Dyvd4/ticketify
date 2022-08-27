import { faBold, faCode, faItalic, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditorState, RichUtils } from "draft-js";
import { InlineStyle, InlineStyleButtonMap } from "../Editor";
import InlineStyleButton from "./InlineStyleButton";

const inlineStyleButtonMap: InlineStyleButtonMap = {
    "BOLD": <FontAwesomeIcon icon={faBold} />,
    "CODE": <FontAwesomeIcon icon={faCode} />,
    "ITALIC": <FontAwesomeIcon icon={faItalic} />,
    "UNDERLINE": <FontAwesomeIcon icon={faUnderline} />
}

type InlineStyleButtonsProps = {
    editorState: EditorState
    actions: Array<InlineStyle>
    onChange(editorState: EditorState)
} & React.ComponentPropsWithRef<"div">

function InlineStyleButtons({ className, actions, editorState, ...props }: InlineStyleButtonsProps) {
    const handleChange = (action: string) => {
        props.onChange(RichUtils.toggleInlineStyle(editorState, action))
    }
    const activeActions = editorState.getCurrentInlineStyle()
    return (
        <div className={`flex items-center gap-2
                        ${className}`}
            {...props}>
            {actions.map(action => (
                <InlineStyleButton
                    active={activeActions.has(action)}
                    onClick={() => handleChange(action)}
                    key={action}>
                    {inlineStyleButtonMap[action]}
                </InlineStyleButton>
            ))}
        </div>
    );
}

export default InlineStyleButtons;