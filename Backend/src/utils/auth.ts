import nodeMailer from "../services/nodeMailer";
import dotenv from "dotenv";
import path from "path";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const URL = process.env.URL!;
const SECRET_KEY = process.env.JWT_SECRET_KEY!;
const fromEmail = process.env.SUPPORT_EMAIL;

export const sendEmailConfirmationEmail = async (user: User) => {
    const redirectToken = jwt.sign({
        data: {
            userId: user.id
        }
    }, SECRET_KEY);

    return nodeMailer.sendMail({
        from: fromEmail,
        to: user.email!,
        html: `Click <a href='${URL}/auth/confirmEmail/${redirectToken}' target="_blank">here</a> to verify yourself to ticketify`
    });
}