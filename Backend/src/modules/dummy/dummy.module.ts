import { Module } from "@nestjs/common";
import { FileModule } from "@src/modules/file/file.module";
import { MailModule } from "@src/modules/mail/mail.module";
import { DummyController } from "./dummy.controller";

@Module({
    imports: [FileModule, MailModule],
    providers: [],
    controllers: [DummyController],
})
export class DummyModule {}
