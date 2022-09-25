import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authentication } from "./middlewares/auth";
import { errorHandler } from "./middlewares/errorHandler";
import ticketActivity from "./middlewares/prisma/ticketActivity";
import userSignature from "./middlewares/prisma/userSignature";
import { customRequest } from "./middlewares/requests";
import AuthRouter from "./routes/Auth";
import CommentRouter from "./routes/Comment";
import CommentInteractionRouter from "./routes/CommentInteraction";
import ErrorRouter from "./routes/Error";
import FileRouter from "./routes/File";
import TestRouter from "./routes/Test";
import TicketRouter from "./routes/Ticket";
import TicketActivityRouter from "./routes/TicketActivity";
import TicketDueDateRouter from "./routes/TicketDueDate";
import TicketPriorityRouter from "./routes/TicketPriority";
import TicketStatusRouter from "./routes/TicketStatus";
import UserRouter from "./routes/User";
import backgroundServices from "./services/background/index";
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
server.use("/api", CommentInteractionRouter);
server.use("/api", TicketActivityRouter);

server.use(errorHandler);

server.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
});

const prisma = new PrismaClient();
prisma.$use(ticketActivity("Comment"));
prisma.$use(userSignature);

backgroundServices();
export { prisma };
