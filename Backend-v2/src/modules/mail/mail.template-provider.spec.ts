import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import config from "@config";
import { MailTemplateProvider } from "./mail.template-provider";

const htmlTemplate = `
<p>
    {{user.firstName}}
</p>
<p>
    {{user.lastName}}
</p>
`;

describe("when generating injected html", () => {

	let mailTemplateProvider: MailTemplateProvider

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [ConfigModule.forRoot({
				isGlobal: true,
				load: [config]
			})],
			providers: [MailTemplateProvider]
		}).compile();

		mailTemplateProvider = moduleRef.get(MailTemplateProvider);
	})

	test("getInjectedHtml renders context variables", async () => {
		const user = {
			firstName: "David",
			lastName: "Kimmich"
		}
		const injectedHtml = await mailTemplateProvider.getInjectedHtml(htmlTemplate, {
			user
		});

		expect(new RegExp(`${user.firstName}`, "g").exec(injectedHtml)).toHaveLength(1);
		expect(new RegExp(`${user.lastName}`, "g").exec(injectedHtml)).toHaveLength(1);
	});
	
	test("getInjectedHtmlFromFile renders context variables", async () => {
		const user = {
			firstName: "David",
			lastName: "Kimmich"
		}
		const injectedHtml = await mailTemplateProvider.getInjectedHtmlFromFile("Test", {
			user
		});

		expect(new RegExp(`${user.firstName}`, "g").exec(injectedHtml)).toHaveLength(1);
		expect(new RegExp(`${user.lastName}`, "g").exec(injectedHtml)).toHaveLength(1);
	});
});