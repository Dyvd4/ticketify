import path from "path";

const NODE_ENV = process.env.NODE_ENV!;

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
	get ASSETS_PATH() {
		return NODE_ENV === "test"
			? path.join(__dirname, "assets")
			: path.join(__dirname, "../", "assets")
	},
	get HTML_EMAIL_TEMPLATES_PATH() {
		return path.join(this.ASSETS_PATH, "html-templates");
	},
}

export type Config = typeof config;
export default () => config;
