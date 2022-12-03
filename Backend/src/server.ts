import config from "@config";
import backgroundAgents from "@lib/backgroundAgents/index";
import { authentication, authorization } from "@middlewares/auth";
import { errorHandler } from "@middlewares/errorHandler";
import { customRequest } from "@middlewares/requests";
import cors from "cors";
import express from "express";
import AuthController from "./controller/Auth";
import CommentController from "./controller/Comment";
import CommentInteractionController from "./controller/CommentInteraction";
import ErrorController from "./controller/Error";
import FileController from "./controller/File";
import LogController from "./controller/Log";
import TestController from "./controller/Test";
import TicketController from "./controller/Ticket";
import TicketActivityController from "./controller/TicketActivity";
import TicketDueDateController from "./controller/TicketDueDate";
import TicketPriorityController from "./controller/TicketPriority";
import TicketStatusController from "./controller/TicketStatus";
import UserController from "./controller/User";
import UserSettingsController from "./controller/UserSettings";
import { getCurrentUser } from "./entity/services/currentUser";
import logger from "./logger";

const { PORT } = config;

const server = express();

server.use(express.json({ limit: "200mb" }));
server.use(cors());

server.use(customRequest)
server.use("/api", ErrorController);
server.use("/api/auth", AuthController);
server.use("/api", UserController);
server.use("/api", authentication(), TicketController);
server.use("/api", authentication(), TicketPriorityController);
server.use("/api", authentication(), CommentController);
server.use("/api", authentication(), TicketDueDateController);
server.use("/api", authentication(), TestController);
server.use("/api", authentication(), TicketStatusController);
server.use("/api", authentication(), FileController);
server.use("/api", authentication(), CommentInteractionController);
server.use("/api", authentication(), TicketActivityController);
server.use("/api", authentication(), LogController);
server.use("/api", authorization({
    strategy: (user) => [
        user.id === getCurrentUser().id,
        "You try to modify user setting af an other user. That is not allowed."
    ]
}), UserSettingsController);

server.use(errorHandler);

server.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`, { private: true });
});

backgroundAgents();