import logger from "../services/logger";

export const errorHandler = (err: Error, req, res, next) => {
    logger.error({
        message: "Unhandled exception / rejection",
        error: err.message,
        stack: err.stack
    });
    res.status(500).json({
        error: String(err)
    });
}