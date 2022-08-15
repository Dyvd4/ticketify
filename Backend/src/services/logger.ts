import winston, { createLogger, format, transports } from "winston";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const logPath = path.join(__dirname, "../../", process.env.logPath!);

const logger = createLogger({
    level: "info",
    transports: [
        new transports.File({
            filename: `${logPath}comined.json`
        }),
        new transports.File({
            level: "error",
            filename: `${logPath}error.json`
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: `${logPath}exceptions.json` }),
        new transports.Console({ format: winston.format.simple() })
    ],
    rejectionHandlers: [
        new transports.File({ filename: `${logPath}rejections.json` }),
        new transports.Console({ format: winston.format.simple() })
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: winston.format.simple()
    }));
}

export default logger;