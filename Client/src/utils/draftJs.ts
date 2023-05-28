import { ContentState, EditorState } from "draft-js";

export const getEmptyState = (editorState: EditorState) => {
	return EditorState.push(editorState, ContentState.createFromText(""), "remove-range");
};
