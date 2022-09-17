import path from "path";
import fs from "fs/promises";
import logger from "../logger";

const uploadPath = path.join(__dirname, "../../../upload");

const uploadCleanupService = async () => {
    try {
        await fs.rm(uploadPath, { recursive: true, force: true })
    }
    catch (e) {
        logger.error(e);
    }
}

export default uploadCleanupService;