import { useAtom } from "jotai";
import { useEffect } from "react";
import { portalIsRenderedAtom } from "src/context/atoms";

function PortalSlot() {

    const [, setPortalIsRendered] = useAtom(portalIsRenderedAtom);

    useEffect(() => {
        setPortalIsRendered(true);
    }, []);

    return <div id="portal"></div>
}

export default PortalSlot;