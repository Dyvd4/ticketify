import config from "@config";
import backgroundAgents from "@lib/background-agents/index";
import { authentication, authorization } from "@core/middlewares/Auth";
import ErrorHandler from "@lib/middlewares/ErrorHandler";
import CustomRequest from "@lib/middlewares/CustomRequest";
import cors from "cors";
import express from "express";
import AuthController from "@controller/AuthController";
import CommentController from "@controller/CommentController";
import CommentInteractionController from "@controller/CommentInteractionController";
import ErrorController from "@controller/ErrorController";
import FileController from "@controller/FileController";
import LogController from "@controller/LogController";
import TestController from "@controller/TestController";
import TicketController from "@controller/TicketController";
import TicketActivityController from "@controller/TicketActivityController";
import TicketDueDateController from "@controller/TicketDueDateController";
import TicketPriorityController from "@controller/TicketPriorityController";
import TicketStatusController from "@controller/TicketStatusController";
import UserController from "@controller/UserController";
import UserSettingsController from "@controller/UserSettingsController";
import { getCurrentUser } from "@core/services/CurrentUserService";
import logger from "./logger";
import TicketOnTicketController from "@controller/TicketOnTicketController";
import TicketWatcherController from "@controller/TicketWatcherController";

const { PORT } = config;

const server = express();

server.use(express.json({ limit: "200mb" }));
server.use(cors());

server.use(CustomRequest)
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
server.use("/api", authentication(), TicketOnTicketController);
server.use("/api", authentication(), TicketWatcherController);
server.use("/api", authorization({
    strategy: (user) => [
        user.id === getCurrentUser().id,
        "You try to modify user setting af an other user. That is not allowed."
    ]
}), UserSettingsController);

server.use(ErrorHandler);

server.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`, { private: true });
});

backgroundAgents();