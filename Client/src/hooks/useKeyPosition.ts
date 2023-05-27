import { useEffect, useState } from "react";

type UseKeyPositionOptions = {
    events?: {
        onArrowDown?(keyPosition: number): void;
        onArrowUp?(keyPosition: number): void;
        onEnter?(keyPosition: number): void;
    };
};

/** updates key position based on the `ArrowUp` and `ArrowDown` event */
const useKeyPosition = (limit: number, options?: UseKeyPositionOptions) => {
    const [keyPosition, setKeyPosition] = useState(0);

    const handleKeyDown = (e) => {
        setKeyPosition((keyPosition) => {
            if (e.key === "ArrowUp" && keyPosition > 0) {
                const newKeyPosition = keyPosition - 1;
                options?.events?.onArrowUp?.(newKeyPosition);
                return newKeyPosition;
            }
            if (e.key === "ArrowDown" && keyPosition < limit) {
                const newKeyPosition = keyPosition + 1;
                options?.events?.onArrowDown?.(newKeyPosition);
                return newKeyPosition;
            }
            if (e.key === "Enter") {
                options?.events?.onEnter?.(keyPosition);
                return keyPosition;
            }
            return keyPosition;
        });
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return [keyPosition, setKeyPosition] as const;
};

export default useKeyPosition;
