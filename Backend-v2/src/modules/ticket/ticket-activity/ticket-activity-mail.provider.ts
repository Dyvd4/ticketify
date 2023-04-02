import MailTransporter from "@src/modules/mail/mail.transporter";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Config } from "@src/config";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { MailTemplateProvider } from "@src/modules/mail/mail-template.provider";
import jwt from "jsonwebtoken";

@Injectable()
export class TicketActivityMailProvider {

	private JWT_SECRET_KEY: string
	private SUPPORT_EMAIL: string

	constructor(
		private readonly prisma: PrismaService,
		private readonly mailTemplateProvider: MailTemplateProvider,
		configService: ConfigService
	) {
		this.JWT_SECRET_KEY = configService.get<Config>("JWT_SECRET_KEY", { infer: true })
		this.SUPPORT_EMAIL = configService.get<Config>("SUPPORT_EMAIL", { infer: true })
	}

	async sendEmailToWatchingUsers(ticketActivityId: string) {
		const { prisma } = this;

		const ticketActivity = (await prisma.ticketActivity.findUnique({
			where: {
				id: ticketActivityId
			}
		}))!;

		const { title, ticketId } = ticketActivity;

		const ticketWatcher = await prisma.ticketWatcher.findMany({
			where: {
				ticketId
			},
			include: {
				user: true,
				ticket: true
			}
		});

		return Promise.all(ticketWatcher.map(({ user, ticket }) => (
			(async () => {
				const encodedUserId = jwt.sign({
					data: {
						userId: user.id
					}
				}, this.JWT_SECRET_KEY)

				const html = await this.mailTemplateProvider.getInjectedHtmlFromFile("TicketActivityTemplate", {
					URL,
					ticket,
					user,
					ticketActivity,
					encodedUserId
				});
				
				return MailTransporter.sendMail({
					from: this.SUPPORT_EMAIL,
					to: user.email!,
					subject: `New activity on ticket '#${ticket.id} ${ticket.title}' ==> ${title}`,
					html
				})
			})()
		)));
	}
}