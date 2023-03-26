import { Controller, Get, Param, ParseArrayPipe, Query } from "@nestjs/common";
import { Auth } from "@src/global/auth/auth.decorator";
import { MailTemplateProvider } from "@src/mail/mail.template-provider";
import { SomeObjDto } from "./dummy.dtos";

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

	@Get("getWithObjectUrlParams")
	getWithObjectUrlParams(
		@Query() someObj: SomeObjDto
	) {
		return someObj;
	}

	@Get("getWithArrayParams")
	getWithArrayParams(
		@Query("excludeIds", new ParseArrayPipe({ items: Number, optional: true })) excludeIds: number[] = []
	) {
		return excludeIds;
	}
}