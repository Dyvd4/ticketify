import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const config = {
    LOG_PATH: path.join(__dirname, "../logs", "/"),
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
    CLIENT_URL: process.env.CLIENT_URL!,
    // file
    // ====
    FILE_UPLOAD_PATH: path.join(__dirname, "../file-upload"),
    FILE_UPLOAD_ROUTE_NAME: "file-upload",
    FILE_IMAGE_MAX_SIZE_KB: parseInt(process.env.FILE_IMAGE_MAX_SIZE_KB!),
    FILE_IMAGE_MAX_COUNT: parseInt(process.env.FILE_IMAGE_MAX_COUNT!),
    FILE_MAX_SIZE_KB: parseInt(process.env.FILE_MAX_SIZE_KB!),
    FILE_MAX_COUNT: parseInt(process.env.FILE_MAX_COUNT!),
    // ====
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    URL: process.env.URL!,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    PORT: process.env.PORT!,
    VALID_IMAGETYPES_REGEX: process.env.VALID_IMAGETYPES_REGEX!,
    HTML_EMAIL_TEMPLATES_PATH: path.join(__dirname, "./core/mail-delivery/html-templates")
}

export default config