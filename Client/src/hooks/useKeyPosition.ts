import { useEffect, useState } from "react";

const useKeyPosition = (limit: number) => {

    const [keyPosition, setKeyPosition] = useState(0);

    const handleKeyDown = e => {
        setKeyPosition(keyPosition => {
            if (e.key === "ArrowUp" && keyPosition > 0) {
                return keyPosition - 1;
            }
            if (e.key === "ArrowDown" && keyPosition < limit) {
                return keyPosition + 1;
            }
            return keyPosition;
        })
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, []);

    return [keyPosition, setKeyPosition] as const;
}


export default useKeyPosition;