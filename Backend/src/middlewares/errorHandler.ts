import logger from "../services/logger";

export const errorHandler = (err, req, res, next) => {
    logger.error({
        message: "Unhandled exception / rejection",
        error: String(err)
    });
    res.status(500).json({
        error: String(err)
    });
}