import MailTemplateProvider from "@lib/MailTemplateProvider"

const htmlTemplate = `
<p>
    {{user.firstName}}
</p>
<p>
    {{user.lastName}}
</p>
`;

describe("when generating injected html", () => {
    test("getInjectedHtml renders context variables", async () => {
        const user = {
            firstName: "David",
            lastName: "Kimmich"
        }
        const injectedHtml = await MailTemplateProvider.getInjectedHtml(htmlTemplate, {
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
        const injectedHtml = await MailTemplateProvider.getInjectedHtmlFromFile("Test", {
            user
        });

        expect(new RegExp(`${user.firstName}`, "g").exec(injectedHtml)).toHaveLength(1);
        expect(new RegExp(`${user.lastName}`, "g").exec(injectedHtml)).toHaveLength(1);
    });
});