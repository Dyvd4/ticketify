import { Module } from "@nestjs/common";
import { MailModule } from "@src/modules/mail/mail.module";
import { UserModule } from "@src/modules/user/user.module";
import { TicketActivityMailProvider } from "./ticket-activity-mail.provider";
import { TicketActivityPrismaMiddleWareProvider } from "./ticket-activity-prisma-middleware.provider";
import { TicketActivityController } from "./ticket-activity.controller";

@Module({
    imports: [UserModule, MailModule],
    providers: [TicketActivityMailProvider, TicketActivityPrismaMiddleWareProvider],
    controllers: [TicketActivityController],
    exports: [TicketActivityPrismaMiddleWareProvider],
})
export class TicketActivityModule {}
