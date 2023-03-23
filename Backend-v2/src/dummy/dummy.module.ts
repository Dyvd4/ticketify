import { Module } from "@nestjs/common";
import { MailModule } from "@src/mail/mail.module";
import { DummyController } from "./dummy.controller";

@Module({
	imports: [MailModule],
	controllers: [DummyController]
})
export class DummyModule { }