import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { UserSchema } from "../schemas/User";
import bcrypt from "bcrypt";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const Router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY!;


Router.post("/signIn", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        // check if user exist
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                validation: { message: `User with name: ${username} not existing` }
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                validation: { message: `Password or username is invalid` }
            });
        }

        const authToken = jwt.sign({
            data: {
                userId: user._id
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
        const { username, password } = req.body;

        const alreadyExistingEntity = await User.findOne({ username });
        if (alreadyExistingEntity) {
            return res.status(400).json({
                validation: { message: `User with name: ${username} already existing` }
            });
        }

        const validation = UserSchema.validate({ username, password });
        if (validation.error) return res.status(400).json({ validation });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        const authToken = jwt.sign({
            data: {
                userId: user._id
            }
        }, SECRET_KEY);
        res.json({
            message: "Successfully created user",
            authToken
        });
    }
    catch (e) {
        next(e);
    }
});

export default Router;