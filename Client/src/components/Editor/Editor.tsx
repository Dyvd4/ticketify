import CodeTool from "@editorjs/code";
import EditorJS, { API, OutputData } from "@editorjs/editorjs";
import { BlockMutationEvent } from "@editorjs/editorjs/types/events/block";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import ListTool from "@editorjs/list";
import { ComponentPropsWithRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { addEntity } from "src/api/entity";
import { cn } from "src/utils/component";

type _EditorProps = {
	isReadOnly?: boolean;
	data?: OutputData;
	onMount?(editor: EditorJS): void;
	onChange?(api: API, event: BlockMutationEvent | BlockMutationEvent[]): void;
};

export type EditorProps = _EditorProps & Omit<ComponentPropsWithRef<"div">, keyof _EditorProps>;

function Editor({ className, data, isReadOnly, onChange, onMount, ...props }: EditorProps) {
	const editorRef = useRef<EditorJS | null>(null);
	const [isMounted, setIsMounted] = useState(false);
	const editorId = useId();

	useEffect(() => {
		setIsMounted(true);
		return () => {
			editorRef.current?.destroy();
			editorRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (isMounted) {
			initEditor();
		}
	}, [isMounted]);

	const initEditor = useCallback(async () => {
		const myEditor = new EditorJS({
			holder: editorId,
			autofocus: true,
			placeholder: !isReadOnly ? "Let`s write..." : false,
			tools: {
				header: Header,
				image: {
					class: ImageTool,
					config: {
						uploader: {
							async uploadByFile(file: File) {
								const formData = new FormData();
								formData.append("files", file);
								const response = await addEntity({
									route: "images",
									payload: formData,
									options: {
										headers: {
											"content-type": "multipart/form-data",
										},
									},
								});
								return {
									success: 1,
									file: {
										url: response.data.items[0].url,
									},
								};
							},
						},
					},
				},
				list: ListTool,
				code: CodeTool,
			},
			data,
			onReady() {
				onMount?.(myEditor);
				editorRef.current = myEditor;
			},
			onChange,
			readOnly: isReadOnly,
		});
	}, []);

	return (
		<>
			<div id={editorId} className={cn("rounded-md border p-4", className)} {...props} />
		</>
	);
}

export default Editor;
