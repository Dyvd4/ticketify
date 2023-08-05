import { useAtom } from "jotai";
import { useEffect } from "react";
import { portalIsRenderedAtom } from "src/context/atoms";

function PortalSlot() {
	const [, setPortalIsRendered] = useAtom(portalIsRenderedAtom);

	useEffect(() => {
		setPortalIsRendered(true);
		document.getElementById("container")?.remove(); // TODO: remove this dirty fix
	}, []);

	return <div id="portal"></div>;
}

export default PortalSlot;
