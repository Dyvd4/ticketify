import { LegacyRef, forwardRef } from "react";

type FileInputProps = {
	onChange?(files: FileList | null);
} & Omit<React.ComponentPropsWithRef<"input">, "file" | "size" | "onChange">;

const FileInput = forwardRef(
	(
		{ name, onChange, ...props }: FileInputProps,
		ref: LegacyRef<HTMLInputElement> | undefined
	) => {
		const handleChange = (e: React.SyntheticEvent) => {
			const files = (e.target as HTMLInputElement).files;
			if (onChange) onChange(files);
		};
		return <input ref={ref} onChange={handleChange} name="files" type="file" {...props} />;
	}
);

export default FileInput;
