import bcrypt from "bcrypt";
import express from "express";
import { authentication } from "../middlewares/auth";
import fileParams from "../schemas/params/File";
import { email as EmailSchema, NewPasswordSchema, username as UsernameSchema } from "../schemas/User";
import { prisma } from "../server";
import { getCurrentUser } from "../services/currentUser";
import { imageUpload, mapFile } from "../utils/file";
import { mapUser } from "../utils/user";
const Router = express.Router();

Router.get("/user", authentication({ half: true }), async (req, res, next) => {
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

Router.get("/user/all", authentication({ half: true }), async (req, res, next) => {
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
        (user as any).avatar = user.avatar?.file
            ? mapFile(user.avatar.file, "base64")
            : null;
        res.json(mapUser(user));
    }
    catch (e) {
        next(e);
    }
});

Router.get("/users", authentication(), async (req, res, next) => {
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

Router.put("/user/username", authentication(), async (req, res, next) => {
    const { UserId } = req;
    const { username } = req.body;
    try {

        const validation = UsernameSchema.validate(username);
        if (validation.error) return res.status(400).json({ validation });

        const existingUsername = await prisma.user.findFirst({
            where: {
                username
            }
        });

        if (existingUsername && username !== getCurrentUser().username) {
            return res.status(400).json({
                validation: {
                    message: `User with name: ${username} already existing`
                }
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: UserId
            },
            data: {
                username
            }
        });

        res.json(mapUser(updatedUser))
    }
    catch (e) {
        next(e);
    }
});

Router.put("/user/email", authentication({ half: true }), async (req, res, next) => {
    const { UserId } = req;
    const { email } = req.body;
    try {

        const validation = EmailSchema.validate({ email });
        if (validation.error) return res.status(400).json({ validation });

        const existingEmail = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (existingEmail && email !== getCurrentUser().email) {
            return res.status(400).json({
                validation: {
                    message: `E-mail: ${email} already existing`
                }
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: UserId
            },
            data: {
                email
            }
        });

        res.json(mapUser(updatedUser))
    }
    catch (e) {
        next(e);
    }
});

Router.put("/user/newPassword", authentication(), async (req, res, next) => {
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

Router.put("/user/avatar", authentication(), imageUpload, async (req, res, next) => {
    const { UserId } = req;
    const file = req.files
        ? req.files[0]
        : null;
    try {
        if (!file) return res.status(400).json({ validation: { message: "You have to provide a file" } });
        const fileToCreateOrUpdate = fileParams(file);
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