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
server.use("/api", TicketWatcherController);

// TODO: should not be application level, make router level instead
server.use("/api", authentication())
server.use("/api", TestController);
server.use("/api", TicketPriorityController);
server.use("/api", TicketController);
server.use("/api", CommentController);
server.use("/api", TicketDueDateController);
server.use("/api", TicketStatusController);
server.use("/api", FileController);
server.use("/api", CommentInteractionController);
server.use("/api", TicketActivityController);
server.use("/api", LogController);
server.use("/api", TicketOnTicketController);

// TODO: should not be application level, make router level instead
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