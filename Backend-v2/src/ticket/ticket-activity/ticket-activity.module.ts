import { Module } from '@nestjs/common';
import { MailModule } from '@src/mail/mail.module';
import { UserModule } from '@src/user/user.module';
import { TicketActivityMailProvider } from './ticket-activity-mail.provider';
import { TicketActivityMiddleWareProvider } from './ticket-activity-middleware.provider';
import { TicketActivityController } from './ticket-activity.controller';

@Module({
	imports: [
		UserModule,
		MailModule
	],
	providers: [
		TicketActivityMailProvider,
		TicketActivityMiddleWareProvider
	],
	controllers: [TicketActivityController],
	exports: [TicketActivityMiddleWareProvider]
})
export class TicketActivityModule { }
