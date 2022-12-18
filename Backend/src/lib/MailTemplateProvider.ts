import fs from "fs/promises"
import Handlebars from "handlebars";
import config from "@config";

const { HTML_EMAIL_TEMPLATES_PATH } = config;

export async function getInjectedHtmlFromFile(htmlTemplateFileName: string, context) {
    const htmlTemplate = await fs.readFile(`${HTML_EMAIL_TEMPLATES_PATH}/${htmlTemplateFileName}.hbs`, { encoding: "utf-8" });
    const template = Handlebars.compile(htmlTemplate);
    return template(context);
}

export async function getInjectedHtml(htmlTemplate: string, context) {
    const template = Handlebars.compile(htmlTemplate);
    return template(context);
}

export default {
    getInjectedHtmlFromFile,
    getInjectedHtml
}