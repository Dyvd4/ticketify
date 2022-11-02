import { User } from "@prisma/client";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { prisma } from "../server";
import { getCurrentUser, setCurrentUser } from "../services/currentUser";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

const getUserId = (authToken: string) => {
    const decoded = jwt.verify(authToken, SECRET_KEY) as { data: { userId: string } };
    return decoded.data.userId;
}

/** @returns true if authentication passes */
const _authentication = async (half, req, res) => {

    const authToken = req.header("auth-token");
    if (!authToken) {
        res.status(401).json("auth-token is undefined");
        return false;
    }

    const userId = getUserId(authToken);
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    });

    if (!user) {
        res.status(404).json("user to corresponding id from auth-token not found");
        return false;
    }

    let authenticated = half
        ? isHalfAuthenticated(user)
        : isAuthenticated(user)

    if (!authenticated) {
        res.status(401).json("Not authenticated");
        return false;
    }

    setCurrentUser(user);
    req.UserId = userId;

    return true;
}

interface AuthenticationParams {
    /** If set to true, checks if user is half authenticated instead of full.
     * Half authenticated means that the e-mail is not confirmed yet.
     */
    half: boolean
}
export const authentication = (params?: AuthenticationParams) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const passes = await _authentication(params?.half, req, res);
        if (!passes) return;

        next();
    }
}

interface AuthorizationParams {
    /**
     * @returns 
     * - true as first tuple item if user should pass the authorization
     * - response message as second tuple item that is sent if the authorization fails
     * */
    strategy: (user: User) => [boolean, string]
}
export const authorization = (params?: AuthorizationParams) => {

    const authorizationStrategy = params?.strategy || (() => [true, ""]);

    return async (req: Request, res: Response, next: NextFunction) => {

        const passes = await _authentication(false, req, res);
        if (!passes) return;

        const [isAuthorized, authorizationFailedMessage] = authorizationStrategy(getCurrentUser());
        if (!isAuthorized) return res.status(401).json(authorizationFailedMessage);

        next();
    }
}

export const isHalfAuthenticated = (user) => !!user;
export const isAuthenticated = (user) => !!user && user.emailConfirmed;
export const isAuthorized = (user) => isAuthenticated(user);