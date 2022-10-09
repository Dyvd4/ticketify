import { useEffect, useState } from "react"

/** determines if the ref has overflow (only on componentDidMount) */
const useHasOverflow = (ref: React.MutableRefObject<HTMLElement | null>) => {
    const [hasOverflow, setHasOverflow] = useState(false);
    useEffect(() => {
        setHasOverflow(ref.current!.clientHeight < ref.current!.scrollHeight);
    }, []);
    return hasOverflow;
}
export default useHasOverflow