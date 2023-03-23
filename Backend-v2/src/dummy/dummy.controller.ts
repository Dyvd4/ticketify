import { Controller, Get } from "@nestjs/common";
import { Auth } from "@src/global/auth/auth.decorator";
import { MailTemplateProvider } from "@src/mail/mail.template-provider";

@Auth({ disable: true })
@Controller('dummy')
export class DummyController {

	constructor(private mailTemplateProvider: MailTemplateProvider) { }

	@Get('getTiddies')
	tiddies() {
		return "Gimme them";
	}

	@Get('getHtmlTemplate')
	async getHtmlTemplate() {
		const user = {
			firstName: "David",
			lastName: "Kimmich"
		}
		const html = await this.mailTemplateProvider.getInjectedHtmlFromFile("Test", { user });
		return html;
	}
}