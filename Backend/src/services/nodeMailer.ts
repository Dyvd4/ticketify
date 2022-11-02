import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const username = process.env.SMTP_USERNAME;
const password = process.env.SMTP_PASSWORD;

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