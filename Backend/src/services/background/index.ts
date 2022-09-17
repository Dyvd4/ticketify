import cron from "node-cron";
import logsCleanupService from "./logsCleanup";
import uploadCleanupService from "./uploadCleanup";

const backgroundServices = () => {
    // At 12:00 AM
    cron.schedule("0 0 * * *", uploadCleanupService);
    // At 12:00 AM, on day 15 of the month
    cron.schedule("0 0 15 * *", logsCleanupService);
}

export default backgroundServices;