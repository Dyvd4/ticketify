import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });
import logger from "../services/logger";

const CONNECTION_STRING = process.env.CONNECTION_STRING!;

export const connect = () => {
    mongoose.connect(CONNECTION_STRING, () => {
        logger.info("Database connected");
    });
}