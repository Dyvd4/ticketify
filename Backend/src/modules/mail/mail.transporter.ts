import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
        user: username,
        pass: password,
    },
});

export default transporter;
