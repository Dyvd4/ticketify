import { useRef } from "react";
import ReactDom from "react-dom";

type Props = {
	loading: boolean;
	usePortal?: boolean;
	useCover?: boolean;
	loadingCoverStyle?: any;
	size?: string;
	borderWidth?: string;
	className?: string;
};

function LoadingCircle(props: Props) {
	const loadingCoverRef = useRef<HTMLDivElement>(null);
	let { loading, usePortal, loadingCoverStyle, useCover } = props;
	let size = props.size ? props.size : "1.25em";
	let borderWidth = props.borderWidth ? props.borderWidth : ".5em";
	let className = props.className
		? props.className
		: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50";
	if (useCover && loading && loadingCoverRef.current && loadingCoverRef.current.parentElement) {
		let parent = loadingCoverRef.current.parentElement;
		parent.style.pointerEvents = "none";
	} else if (
		useCover &&
		!loading &&
		loadingCoverRef.current &&
		loadingCoverRef.current.parentElement
	) {
		let parent = loadingCoverRef.current.parentElement;
		parent.style.pointerEvents = "auto";
	}
	if (usePortal) {
		return ReactDom.createPortal(
			<div className={className}>
				<div
					style={{ width: size, height: size, borderWidth }}
					className={loading ? "loading" : "hidden"}
				></div>
			</div>,
			document.getElementById("loading-circle")!
		);
	}
	return (
		<>
			{!!useCover && loading && (
				<div
					ref={loadingCoverRef}
					style={loadingCoverStyle ? loadingCoverStyle : {}}
					className="loading-cover"
				></div>
			)}
			<div className={className}>
				<div
					style={{ width: size, height: size, borderWidth }}
					className={loading ? "loading" : "hidden"}
				></div>
			</div>
		</>
	);
}

export default LoadingCircle;
