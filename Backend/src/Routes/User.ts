import express from "express";
const Router = express.Router();
import { prisma } from "../server";

Router.get("/user", async (req, res, next) => {
    const { UserId } = req;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: UserId
            }
        });
        if (!user) return res.status(404).json(null);
        res.json({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
    catch (e) {
        next(e);
    }
})

export default Router;