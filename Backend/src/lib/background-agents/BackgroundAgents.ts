import cron from "node-cron";
import LogsCleanupAgent from "./LogsCleanupAgent";
import UploadCleanupAgent from "./UploadCleanupAgent";

const BackgroundAgents = () => {
    // At 12:00 AM
    cron.schedule("0 0 * * *", UploadCleanupAgent);
    // At 12:00 AM, on day 15 of the month
    cron.schedule("0 0 15 * *", LogsCleanupAgent);
}

export default BackgroundAgents;