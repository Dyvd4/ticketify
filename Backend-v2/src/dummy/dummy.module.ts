import { Module } from "@nestjs/common";
import { FileModule } from "@src/file/file.module";
import { MailModule } from "@src/mail/mail.module";
import { DummyController } from "./dummy.controller";

@Module({
	imports: [FileModule, MailModule],
	providers: [],
	controllers: [DummyController]
})
export class DummyModule { }