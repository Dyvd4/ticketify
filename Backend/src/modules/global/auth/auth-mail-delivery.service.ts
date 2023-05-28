import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Config } from "@config";
import { MailTemplateProvider } from "@src/modules/mail/mail-template.provider";
import MailTransporter from "@src/modules/mail/mail.transporter";

@Injectable()
export class AuthMailDeliveryService {
	private JWT_SECRET_KEY: string;
	private SUPPORT_EMAIL: string;
	private URL: string;

	constructor(configService: ConfigService, private MailTemplateProvider: MailTemplateProvider) {
		this.JWT_SECRET_KEY = configService.get<Config>("JWT_SECRET_KEY", { infer: true });
		this.SUPPORT_EMAIL = configService.get<Config>("SUPPORT_EMAIL", { infer: true });
		this.URL = configService.get<Config>("URL", { infer: true });
	}

	sendEmailConfirmationEmail = async (user: User) => {
		const encodedUserId = jwt.sign(
			{
				data: {
					userId: user.id,
				},
			},
			this.JWT_SECRET_KEY
		);

		const html = await this.MailTemplateProvider.getInjectedHtmlFromFile(
			"UserEmailConfirmationTemplate",
			{ encodedUserId, URL: this.URL }
		);

		return MailTransporter.sendMail({
			from: this.SUPPORT_EMAIL,
			to: user.email!,
			subject: "E-mail verification for ticketify",
			html,
		});
	};
}
