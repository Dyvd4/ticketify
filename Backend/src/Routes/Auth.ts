import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { authentication } from "../middlewares/auth";
import UserSchema, { UserSignInSchema } from "../schemas/User";
import { prisma } from "../server";
import { sendEmailConfirmationEmail } from "../utils/auth";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY!;
const CLIENT_URL = process.env.CLIENT_URL!;

Router.post("/signIn", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const validation = UserSignInSchema.validate({ username, password });
        if (validation.error) return res.status(400).json({ validation });

        // check if user exist
        const user = await prisma.user.findFirst({
            where: {
                username
            }
        });

        if (!user) {
            return res.status(400).json({
                validation: {
                    message: `User with name: ${username} not existing`
                }
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                validation: { message: `Password or username is invalid` }
            });
        }

        const authToken = jwt.sign({
            data: {
                userId: user.id
            }
        }, SECRET_KEY);
        res.json({
            message: "Successfully signed in user",
            authToken
        });
    }
    catch (e) {
        next(e);
    }
});

Router.post("/signUp", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUsername = await prisma.user.findFirst({
            where: {
                username
            }
        });

        if (existingUsername) {
            return res.status(400).json({
                validation: {
                    message: `User with name: ${username} already existing`
                }
            });
        }

        const existingEmail = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (existingEmail) {
            return res.status(400).json({
                validation: {
                    message: `Email: ${email} already existing`
                }
            });
        }

        const validation = UserSchema.validate({ username, email, password });
        if (validation.error) return res.status(400).json({ validation });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                settings: {
                    create: {}
                }
            }
        });

        const authToken = jwt.sign({
            data: {
                userId: user.id
            }
        }, SECRET_KEY);

        sendEmailConfirmationEmail(user);

        res.json({
            message: "Successfully created user",
            authToken
        });
    }
    catch (e) {
        next(e);
    }
});

Router.post("/confirmEmail", authentication({ half: true }), async (req, res, next) => {
    const { UserId } = req;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: UserId
            }
        });
        await sendEmailConfirmationEmail(user!);
        res.json("Successfully sent e-mail");
    }
    catch (e) {
        next(e)
    }
});

Router.get("/confirmEmail/:redirectToken", async (req, res, next) => {
    const { redirectToken } = req.params;
    try {
        const { data: { userId } } = jwt.verify(redirectToken, SECRET_KEY) as { data: { userId: string } };
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                emailConfirmed: true
            }
        });
        return res.redirect(`${CLIENT_URL}/Auth/EmailConfirmed`);
    }
    catch (e) {
        next(e);
    }
});

export default Router;