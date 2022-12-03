import config from "@config";
import nodeMailer from "@lib/nodeMailer";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const { URL, JWT_SECRET_KEY, SUPPORT_EMAIL } = config

// TODO: move out to e-mail delivery
export const sendEmailConfirmationEmail = async (user: User) => {
    const redirectToken = jwt.sign({
        data: {
            userId: user.id
        }
    }, JWT_SECRET_KEY);

    return nodeMailer.sendMail({
        from: SUPPORT_EMAIL,
        to: user.email!,
        subject: "E-mail verification for ticketify",
        html: `Click <a href='${URL}/auth/confirmEmail/${redirectToken}' target="_blank">here</a> to verify yourself to ticketify`
    });
}