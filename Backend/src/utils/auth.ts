import { User } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import nodeMailer from "../services/nodeMailer";

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
        subject: "E-mail verification for ticketify",
        html: `Click <a href='${URL}/auth/confirmEmail/${redirectToken}' target="_blank">here</a> to verify yourself to ticketify`
    });
}