import { useAtom } from "jotai";
import { useEffect } from "react";
import { pagePortalIsRenderedAtom } from "src/context/atoms";

function PagePortalSlot() {
	const [, setPortalIsRendered] = useAtom(pagePortalIsRenderedAtom);

	useEffect(() => {
		setPortalIsRendered(true);
	}, []);

	return <div id="page-portal"></div>;
}

export default PagePortalSlot;
