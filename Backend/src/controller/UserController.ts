import bcrypt from "bcrypt";
import express from "express";
import { authentication } from "@core/middlewares/Auth";
import { email as EmailSchema, NewPasswordSchema, username as UsernameSchema } from "@core/schemas/UserSchema";
import prisma from "@prisma";
import { getCurrentUser } from "@core/services/CurrentUserService";
import { sendEmailConfirmationEmail } from "@core/services/AuthService";
import { imageUpload } from "@lib/middlewares/FileUpload";
import MulterFileToFileEntityMap from "@core/maps/MulterFileToFileEntityMap";
import FileEntityToClientMap from "@core/maps/FileEntityToClientMap";

const Router = express.Router();

Router.get("/user", authentication({ half: true }), async (req, res, next) => {
    const { UserId } = req;
    const id = req.query.id as string;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id || UserId
            }
        });
        if (!user) return res.status(404).json(null);
        res.json(user);
    }
    catch (e) {
        next(e);
    }
});

Router.get("/user/all", authentication({ half: true }), async (req, res, next) => {
    const { UserId } = req;
    const id = req.query.id as string;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id || UserId
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
            ? FileEntityToClientMap(user.avatar.file, "base64")
            : null;
        res.json(user);
    }
    catch (e) {
        next(e);
    }
});

Router.get("/users", authentication(), async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.json({
            items: users
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

        res.json(updatedUser)
    }
    catch (e) {
        next(e);
    }
});

Router.put("/user/email", authentication({ half: true }), async (req, res, next) => {
    const { UserId } = req;
    const { email } = req.body;
    try {

        const validation = EmailSchema.validate(email);
        if (validation.error) return res.status(400).json({ validation });

        const existingEmail = await prisma.user.findFirst({
            where: {
                email
            }
        });

        const isSameEmail = email === getCurrentUser().email;

        if (existingEmail && !isSameEmail) {
            return res.status(400).json({
                validation: {
                    message: `E-mail: ${email} already existing`
                }
            });
        }

        if (isSameEmail) return res.json("Your e-mail is already equal to the provided value");

        const updatedUser = await prisma.user.update({
            where: {
                id: UserId
            },
            data: {
                email,
                emailConfirmed: false
            }
        });

        if (!isSameEmail) sendEmailConfirmationEmail(updatedUser);

        res.json(updatedUser)
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

        if (!(await bcrypt.compare(passwordData.currentPassword, getCurrentUser().password))) {
            return res.status(400).json({
                validation: {
                    message: "Current password is not valid"
                }
            });
        }

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

        res.json(updatedUser)
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
        const fileToCreateOrUpdate = MulterFileToFileEntityMap(file);
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
        res.json(updatedUser)
    }
    catch (e) {
        next(e);
    }
})

export default Router;