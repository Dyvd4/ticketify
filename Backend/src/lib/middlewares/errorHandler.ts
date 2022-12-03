import logger from "@logger";

export const errorHandler = (err: Error, req, res) => {
    logger.error({
        message: "Unhandled exception / rejection",
        error: {
            message: err.message,
            stack: err.stack
        }
    });
    res.status(500).json({
        error: String(err)
    });
}