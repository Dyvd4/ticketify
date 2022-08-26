import express from "express";
const Router = express.Router();
import { prisma } from "../server";
import { mapUser } from "../utils/user";

Router.get("/user", async (req, res, next) => {
    const { UserId } = req;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: UserId
            }
        });
        if (!user) return res.status(404).json(null);
        res.json(mapUser(user));
    }
    catch (e) {
        next(e);
    }
});

Router.get("/users", async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.json({
            items: users.map(user => mapUser(user))
        });
    }
    catch (e) {
        next(e);
    }
})

export default Router;