import { useEffect, useState } from "react";

const useDebounce = (value, delayInMs: number) => {

    const [debouncedValue, setDebouncedValue] = useState();
    const [isDebouncing, setIsDebouncing] = useState(false);

    useEffect(() => {

        setIsDebouncing(true)

        const timeoutId = setTimeout(() => {
            setDebouncedValue(value)
            setIsDebouncing(false)
        }, delayInMs);

        return () => {
            clearTimeout(timeoutId);
            setIsDebouncing(false)
        }
    }, [value])

    return {
        value: debouncedValue,
        isDebouncing
    };
}

export default useDebounce;