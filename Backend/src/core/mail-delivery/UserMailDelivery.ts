import config from "@config";
import MailTemplateProvider from "@lib/MailTemplateProvider";
import MailTransporter from "@lib/MailTransporter";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const { URL, JWT_SECRET_KEY, SUPPORT_EMAIL } = config

export const sendEmailConfirmationEmail = async (user: User) => {
    const redirectToken = jwt.sign({
        data: {
            userId: user.id
        }
    }, JWT_SECRET_KEY);

    const html = await MailTemplateProvider.getInjectedHtmlFromFile("UserEmailConfirmationTemplate", { redirectToken, URL });

    return MailTransporter.sendMail({
        from: SUPPORT_EMAIL,
        to: user.email!,
        subject: "E-mail verification for ticketify",
        html
    });
}

export default {
    sendEmailConfirmationEmail
}