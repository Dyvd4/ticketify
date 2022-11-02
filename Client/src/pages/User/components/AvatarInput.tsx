import { Avatar, Box, VisuallyHidden } from "@chakra-ui/react";
import { ComponentPropsWithRef, useRef, useState } from "react";
import FileInput from "../../../components/FileInput";

type AvatarInputProps = {
    username: string
    imageSrc?: any
    onChange(file: File | null): void
} & ComponentPropsWithRef<"div">

function AvatarInput({ imageSrc, username, onChange, ...props }: AvatarInputProps) {

    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = async (files: FileList | null) => {
        const file = files && Array.from(files).length > 0
            ? files[0]
            : null
        onChange(file);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        onChange(e.dataTransfer.files?.[0] || null);
    }

    return (
        <Box
            className={`rounded-full relative cursor-pointer z-10
                        flex justify-center items-center
                        ${dragOver ? "border-dashed" : ""}`}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onMouseOver={(e) => setDragOver(true)}
            onMouseOut={(e) => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            {...props}>
            <Avatar
                className="ring-2 ring-sky-500 relative"
                size={"2xl"}
                name={username}
                src={imageSrc}>
                {dragOver && <>
                    <div className="absolute inset-0 rounded-full text-xs
                                bg-black text-white transition-all
                                flex justify-center items-center pointer-events-none">
                        drag image here
                    </div>
                </>}
            </Avatar>
            <VisuallyHidden>
                <FileInput
                    accept={"image/jpeg,image/jpg,image/png"}
                    ref={fileInputRef}
                    onChange={handleChange}
                />
            </VisuallyHidden>
        </Box >
    );
}

export default AvatarInput;