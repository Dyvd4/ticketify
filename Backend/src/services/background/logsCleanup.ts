import path from "path";
import fs from "fs/promises";
import logger from "../logger";

const logsPath = path.join(__dirname, "../../../logs");

const logsCleanupService = async () => {
    try {
        await fs.rm(logsPath, { recursive: true, force: true })
    }
    catch (e) {
        logger.error(e);
    }
}

export default logsCleanupService;