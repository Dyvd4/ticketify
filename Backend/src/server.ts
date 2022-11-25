import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authentication, authorization } from "./middlewares/auth";
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
import LogRouter from "./routes/Log";
import UserSettingsRouter from "./routes/UserSettings";
import { getCurrentUser } from "./services/currentUser";

dotenv.config();

const server = express();
const PORT = process.env.PORT!;

server.use(express.json({ limit: "200mb" }));
server.use(cors());

server.use(customRequest)
server.use("/api", ErrorRouter);
server.use("/api/auth", AuthRouter);
server.use("/api", UserRouter);
server.use("/api", authentication(), TicketRouter);
server.use("/api", authentication(), TicketPriorityRouter);
server.use("/api", authentication(), CommentRouter);
server.use("/api", authentication(), TicketDueDateRouter);
server.use("/api", authentication(), TestRouter);
server.use("/api", authentication(), TicketStatusRouter);
server.use("/api", authentication(), FileRouter);
server.use("/api", authentication(), CommentInteractionRouter);
server.use("/api", authentication(), TicketActivityRouter);
server.use("/api", authentication(), LogRouter);
server.use("/api", authorization({
    strategy: (user) => [
        user.id === getCurrentUser().id,
        "You try to modify user setting af an other user. That is not allowed."
    ]
}), UserSettingsRouter);

server.use(errorHandler);

server.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`, { private: true });
});

const prisma = new PrismaClient();
prisma.$use(ticketActivity("Comment"));
prisma.$use(userSignature);

backgroundServices();
export { prisma };
