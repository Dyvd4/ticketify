import { Config } from "@config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fs from "fs/promises";
import Handlebars from "handlebars";

@Injectable()
export class MailTemplateProvider {
    private HTML_EMAIL_TEMPLATES_PATH: string;

    constructor(configService: ConfigService) {
        this.HTML_EMAIL_TEMPLATES_PATH = configService.get<Config>("HTML_EMAIL_TEMPLATES_PATH", {
            infer: true,
        });
    }

    async getInjectedHtmlFromFile(htmlTemplateFileName: string, context) {
        const htmlTemplate = await fs.readFile(
            `${this.HTML_EMAIL_TEMPLATES_PATH}/${htmlTemplateFileName}.hbs`,
            { encoding: "utf-8" }
        );
        const template = Handlebars.compile(htmlTemplate);
        return template(context);
    }

    async getInjectedHtml(htmlTemplate: string, context) {
        const template = Handlebars.compile(htmlTemplate);
        return template(context);
    }
}
