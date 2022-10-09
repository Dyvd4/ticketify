import { format } from "date-fns";
import dotenv from "dotenv";
import path from "path";
import winston, { createLogger, transports } from "winston";
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

const myFormat = winston.format.printf(({ level, message, error, timestamp }) => {
    timestamp = `[${format(new Date(timestamp), "HH:mm:ss")}]`;
    if (error) return `${timestamp} ${level}: ${error.message}\n stack: ${error.stack}`
    return `${timestamp} ${level}: ${message}`
})

if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            myFormat
        )
    }));
}

export default logger;