import { useAtom } from "jotai";
import ReactDOM from "react-dom";
import { pagePortalIsRenderedAtom, portalIsRenderedAtom } from "src/context/atoms";
import LoadingRipple from "./LoadingRipple";

type _LoadingRippleWithPositioningProps = {
	isAbsolute?: boolean;
};

type LoadingRippleWithPositioningProps = _LoadingRippleWithPositioningProps &
	Omit<React.ComponentPropsWithRef<"div">, keyof _LoadingRippleWithPositioningProps>;

function LoadingRippleWithPositioning({
	isAbsolute,
	className,
	...props
}: LoadingRippleWithPositioningProps) {
	const [portalIsRendered] = useAtom(portalIsRenderedAtom);
	const [pagePortalIsRendered] = useAtom(pagePortalIsRenderedAtom);

	return portalIsRendered && isAbsolute
		? ReactDOM.createPortal(<LoadingRipple />, document.getElementById("portal")!)
		: pagePortalIsRendered
		? ReactDOM.createPortal(<LoadingRipple />, document.getElementById("page-portal")!)
		: null;
}

export default LoadingRippleWithPositioning;
