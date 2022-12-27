import logger from "@logger";

const ErrorHandler = (err: Error, req, res, next) => {
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

export default ErrorHandler;