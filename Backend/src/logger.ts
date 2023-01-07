import prisma from "@prisma";
import { format } from "date-fns";
import winston, { createLogger, transports } from "winston";
import Transport from "winston-transport";
import { LogLevelColorSchemeMap, LogLevelIconMap } from "@lib/data/maps/LogMaps";
import config from "@config";

const { LOG_PATH } = config;

// custom transports
// -----------------
class DbTransport extends Transport {
    constructor(options?: winston.transport.TransportStreamOptions) {
        super(options);
    }
    /** @link example https://www.npmjs.com/package/winston-transport */
    async log(info: winston.Logform.TransformableInfo, next) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        await prisma.log.create({
            data: {
                level: info.level,
                message: info.message,
                errorMessage: info?.error?.message,
                errorStack: info?.error?.stack,
                icon: LogLevelIconMap[info.level],
                color: LogLevelColorSchemeMap[info.level]
            }
        });
        next();
    }
}

// formats
// -------
const privateFormat = winston.format((info) => {
    if (info.private) return false;
    return info;
});

const consoleFormat = winston.format.printf(({ level, message, error, timestamp }) => {
    timestamp = `[${format(new Date(timestamp), "HH:mm:ss")}]`;
    if (error) return `${timestamp} ${level}: ${error.message}\n stack: ${error.stack}`
    return `${timestamp} ${level}: ${message}`
});

const logger = createLogger({
    level: "info",
    transports: [
        new transports.File({
            filename: `${LOG_PATH}combined.json`
        }),
        new transports.File({
            level: "error",
            filename: `${LOG_PATH}error.json`
        }),
        new DbTransport({
            format: winston.format.combine(
                privateFormat()
            )
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: `${LOG_PATH}exceptions.json` }),
        new transports.Console({ format: winston.format.simple() })
    ],
    rejectionHandlers: [
        new transports.File({ filename: `${LOG_PATH}rejections.json` }),
        new transports.Console({ format: winston.format.simple() })
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            consoleFormat
        ),
        handleExceptions: true
    }));
}

export default logger;