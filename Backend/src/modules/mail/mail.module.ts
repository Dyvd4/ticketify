import { Module } from "@nestjs/common";
import { MailTemplateProvider } from "./mail-template.provider";

@Module({
	providers: [MailTemplateProvider],
	exports: [MailTemplateProvider]
})
export class MailModule { }