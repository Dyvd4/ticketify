import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

const getUserId = (authToken: string) => {
    const decoded = jwt.verify(authToken, SECRET_KEY) as { data: { userId: string } };
    return decoded.data.userId;
}

interface authConfig {
    /**
     * @property the api paths that will be excluded from authentication
     */
    excludePaths: Array<string>
}

export const authentication = ({ excludePaths }: authConfig) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (excludePaths.includes(req.path)) return next();
        const authToken = req.header("auth-token");
        if (!authToken) return res.status(401).json({ message: "auth-token is undefined" });
        const userId = getUserId(authToken);
        req.UserId = userId;
        next();
    }
}