import config from "@config";
import AuthController from "@controller/AuthController";
import CommentController from "@controller/CommentController";
import CommentInteractionController from "@controller/CommentInteractionController";
import ErrorController from "@controller/ErrorController";
import FileController from "@controller/FileController";
import LogController from "@controller/LogController";
import TestController from "@controller/TestController";
import TicketActivityController from "@controller/TicketActivityController";
import TicketController from "@controller/TicketController";
import TicketDueDateController from "@controller/TicketDueDateController";
import TicketOnTicketController from "@controller/TicketOnTicketController";
import TicketPriorityController from "@controller/TicketPriorityController";
import TicketStatusController from "@controller/TicketStatusController";
import TicketWatcherController from "@controller/TicketWatcherController";
import UserController from "@controller/UserController";
import UserSettingsController from "@controller/UserSettingsController";
import { authentication, authorization } from "@core/middlewares/Auth";
import { getCurrentUser } from "@core/services/CurrentUserService";
import backgroundAgents from "@lib/background-agents/index";
import CustomRequest from "@lib/middlewares/CustomRequest";
import ErrorHandler from "@lib/middlewares/ErrorHandler";
import cors from "cors";
import express from "express";
import logger from "./logger";

const { FILE_UPLOAD_PATH, FILE_UPLOAD_ROUTE_NAME } = config;
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
server.use(`/api/${FILE_UPLOAD_ROUTE_NAME}`, express.static(FILE_UPLOAD_PATH))
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