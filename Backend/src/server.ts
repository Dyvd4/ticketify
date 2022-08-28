import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authentication } from "./middlewares/auth";
import { errorHandler } from "./middlewares/errorHandler";
import { userSignature } from "./middlewares/prisma";
import { customRequest } from "./middlewares/requests";
import AuthRouter from "./Routes/Auth";
import ErrorRouter from "./Routes/Error";
import UserRouter from "./Routes/User";
import TicketRouter from "./Routes/Ticket";
import TicketPriorityRouter from "./Routes/TicketPriority";
import CommentRouter from "./Routes/Comment";
import TicketDueDateRouter from "./Routes/TicketDueDate";
import TestRouter from "./Routes/Test";
import TicketStatusRouter from "./Routes/TicketStatus";
import FileRouter from "./Routes/File";
import logger from "./services/logger";
dotenv.config();

const server = express();
const PORT = process.env.PORT!;

server.use(express.json());
server.use(cors());

server.use(customRequest)
server.use(authentication({
    excludePaths: ["/api/auth/signIn", "/api/auth/signUp", "/api/error"]
}));
server.use("/api", ErrorRouter);
server.use("/api/auth", AuthRouter);
server.use("/api", UserRouter);
server.use("/api", TicketRouter);
server.use("/api", TicketPriorityRouter);
server.use("/api", CommentRouter);
server.use("/api", TicketDueDateRouter);
server.use("/api", TestRouter);
server.use("/api", TicketStatusRouter);
server.use("/api", FileRouter);

server.use(errorHandler);

server.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
});

const prisma = new PrismaClient();
prisma.$use(userSignature);
export { prisma }