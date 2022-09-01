import express from "express";
import { prisma } from "../server";
import { mapUser } from "../utils/user";
import UserSchema, { NewPasswordSchema, UserUpdateSchema } from "../schemas/User";
import bcrypt from "bcrypt";
const Router = express.Router();

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
});

Router.put("/user", async (req, res, next) => {
    const { UserId } = req;
    const user = req.body;
    try {

        const validation = UserUpdateSchema.validate(user);
        if (validation.error) return res.status(400).json({ validation });

        const updatedUser = await prisma.user.update({
            where: {
                id: UserId
            },
            data: user
        });

        res.json(mapUser(updatedUser))
    }
    catch (e) {
        next(e);
    }
});

Router.put("/user/newPassword", async (req, res, next) => {
    const { UserId } = req;
    const passwordData = req.body;
    try {

        const validation = NewPasswordSchema.validate(passwordData);
        if (validation.error) return res.status(400).json({ validation });

        if (passwordData.newPassword !== passwordData.repeatedNewPassword) {
            return res.status(400).json({
                validation: {
                    message: "passwords are not equal"
                }
            });
        }

        const newPassword = await bcrypt.hash(passwordData.newPassword, 10);
        const updatedUser = await prisma.user.update({
            where: {
                id: UserId
            },
            data: {
                password: newPassword
            }
        });

        res.json(mapUser(updatedUser))
    }
    catch (e) {
        next(e);
    }
});


export default Router;