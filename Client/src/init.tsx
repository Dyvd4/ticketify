import { useApply as useApplyDarkMode } from "./hooks/darkmode";
import { setupErrorHandler } from "./utils/error";

function Init() {
    setupErrorHandler();
    useApplyDarkMode();
    return (
        <div className="hidden"></div>
    );
}

export default Init;