import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fs from "fs/promises";
import Handlebars from "handlebars";
import { Config } from "@config";
import { LogService } from "../log/log.service";

@Injectable()
export class MailTemplateProvider {

	private HTML_EMAIL_TEMPLATES_PATH: string

	constructor(
		configService: ConfigService,
		private logger: LogService
	) {
		this.HTML_EMAIL_TEMPLATES_PATH = configService.get<Config>("HTML_EMAIL_TEMPLATES_PATH", { infer: true });
	}

	async getInjectedHtmlFromFile(htmlTemplateFileName: string, context) {
		try {
			const htmlTemplate = await fs.readFile(`${this.HTML_EMAIL_TEMPLATES_PATH}/${htmlTemplateFileName}.hbs`, { encoding: "utf-8" });
			const template = Handlebars.compile(htmlTemplate);
			return template(context);
		}
		catch (e) {
			this.logger.error((e as Error).message, (e as Error).stack);
		}
	}

	async getInjectedHtml(htmlTemplate: string, context) {
		try {
			const template = Handlebars.compile(htmlTemplate);
			return template(context);
		}
		catch (e) {
			this.logger.error((e as Error).message, (e as Error).stack);
		}
	}
}
