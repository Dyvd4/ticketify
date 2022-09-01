import { Box, Image, VisuallyHidden } from "@chakra-ui/react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef, useRef, useState } from "react";
import FileInput from "./FileInput";

type AvatarInputProps = {
    imageSrc?: any
    onChange(file: File | null): void
} & ComponentPropsWithRef<"div">

function AvatarInput({ imageSrc, onChange, ...props }: AvatarInputProps) {

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
            className={`rounded-full w-40 h-40 relative overflow-hidden
                        flex justify-center items-center
                        border-4 border-sky-500
                        cursor-pointer
                        ${dragOver ? "border-dashed" : ""}`}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onMouseOver={(e) => setDragOver(true)}
            onMouseOut={(e) => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            {...props}>
            {dragOver && <>
                <div className="absolute inset-0 rounded-full
                                bg-black text-white transition-all
                                flex justify-center items-center">
                    drag image here
                </div>
            </>}
            {imageSrc && !dragOver && <>
                <Image className="object-cover w-full h-full" src={imageSrc} />
            </>}
            {!imageSrc && !dragOver && <>
                <FontAwesomeIcon icon={faUser} size={"5x"} />
            </>}
            <VisuallyHidden>
                <FileInput
                    accept={"image/jpeg,image/jpg,image/png"}
                    ref={fileInputRef}
                    onChange={handleChange}
                />
            </VisuallyHidden>
        </Box>
    );
}

export default AvatarInput;