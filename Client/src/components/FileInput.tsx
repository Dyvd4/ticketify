type FileInputProps = {
    onChange?(files: FileList | null)
} & Omit<React.ComponentPropsWithRef<"input">, "file" | "size" | "onChange">

function FileInput({ name, onChange, ...props }: FileInputProps) {
    const handleChange = (e: React.SyntheticEvent) => {
        const files = (e.target as HTMLInputElement).files;
        if (onChange) onChange(files);
    }
    return (
        <input
            onChange={handleChange}
            name="files"
            type="file"
            {...props}
        />
    );
}

export default FileInput;

