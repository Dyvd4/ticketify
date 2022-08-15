import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import TodoRouter from "./Routes/Todos";
import ErrorRouter from "./Routes/Error";
import AuthRouter from "./Routes/Auth";
import UserRouter from "./Routes/User";
import { authentication } from "./middlewares/auth";
import { connect as connectDatabase } from "./utils/database";
import { customRequest } from "./middlewares/requests";
import { errorHandler } from "./middlewares/errorHandler";
import logger from "./services/logger";
dotenv.config();

const server = express();
const PORT = process.env.PORT!;

server.use(express.json());
server.use(cors());

server.use(customRequest)
server.use(authentication({
    excludePaths: ["/api/auth/signIn", "/api/auth/signUp", "/api/error", "/api/todos"]
}));
server.use("/api", ErrorRouter);
server.use("/api", TodoRouter);
server.use("/api/auth", AuthRouter);
server.use("/api", UserRouter);

server.use(errorHandler);

server.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
});

connectDatabase();