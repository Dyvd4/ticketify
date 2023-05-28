import { useApply as useApplyDarkMode } from "./hooks/darkmode";
import { useErrorHandler } from "./hooks/error";

function Init() {
	useErrorHandler();
	useApplyDarkMode();
	return <div className="hidden"></div>;
}

export default Init;
