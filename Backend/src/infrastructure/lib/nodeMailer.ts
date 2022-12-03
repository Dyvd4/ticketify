import config from "@config";
import nodemailer from "nodemailer";

const username = config.SMTP_USERNAME;
const password = config.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
        user: username,
        pass: password
    }
});

export default transporter;