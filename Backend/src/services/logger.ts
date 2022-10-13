import { format } from "date-fns";
import dotenv from "dotenv";
import path from "path";
import winston, { createLogger, Logger, transports } from "winston";
import { LogLevelColorMap, LogLevelIconMap } from "../maps/log";
import { prisma } from "../server";
import Transport from "winston-transport";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const logPath = path.join(__dirname, "../../", process.env.logPath!);

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
                color: LogLevelColorMap[info.level],
                icon: LogLevelIconMap[info.level],
                ...info
            }
        });
        next();
    }
}

// formats
// -------
const privateFormat = winston.format((info, opts) => {
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
            filename: `${logPath}comined.json`
        }),
        new transports.File({
            level: "error",
            filename: `${logPath}error.json`
        }),
        new DbTransport({
            format: winston.format.combine(
                privateFormat()
            )
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
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            consoleFormat
        )
    }));
}

export default logger;