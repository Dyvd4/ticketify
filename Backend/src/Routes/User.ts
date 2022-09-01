import bcrypt from "bcrypt";
import express from "express";
import mapFile from "../schemas/maps/File";
import { NewPasswordSchema, UserUpdateSchema } from "../schemas/User";
import { prisma } from "../server";
import { imageUpload } from "../utils/file";
import { mapUser } from "../utils/user";
const Router = express.Router();

Router.get("/user", async (req, res, next) => {
    const { UserId } = req;
    try {
        let user = await prisma.user.findFirst({
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

Router.get("/user/all", async (req, res, next) => {
    const { UserId } = req;
    try {
        let user = await prisma.user.findFirst({
            where: {
                id: UserId
            },
            include: {
                avatar: {
                    include: {
                        file: true
                    }
                }
            }
        });
        if (!user) return res.status(404).json(null);
        (user as any).avatar = {
            ...user.avatar?.file,
            content: user.avatar?.file.content.toString("base64")
        }
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

Router.put("/user/avatar", imageUpload, async (req, res, next) => {
    const { UserId } = req;
    const file = req.files
        ? req.files[0]
        : null;
    try {
        if (!file) return res.status(400).json({ validation: { message: "You have to provide a file" } });
        const fileToCreateOrUpdate = mapFile(file);
        const updatedUser = await prisma.user.update({
            where: {
                id: UserId
            },
            data: {
                avatar: {
                    upsert: {
                        create: {
                            file: {
                                create: fileToCreateOrUpdate
                            }
                        },
                        update: {
                            file: {
                                update: fileToCreateOrUpdate
                            }
                        }
                    }
                }
            }
        });
        res.json(mapUser(updatedUser))
    }
    catch (e) {
        next(e);
    }
})

export default Router;