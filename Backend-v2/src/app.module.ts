import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { GlobalModule } from './global/global.module';
import { TestController } from './test/test.controller';
import { UserModule } from './user/user.module';
import { CommentInteractionModule } from './comment-interaction/comment-interaction.module';
import { TicketActivityModule } from './ticket-activity/ticket-activity.module';
import { TicketModule } from './ticket/ticket.module';
import { TicketDueDateModule } from './ticket-due-date/ticket-due-date.module';

@Module({
	imports: [
		GlobalModule,
		UserModule,
		CommentModule,
		CommentInteractionModule,
		TicketActivityModule,
		TicketModule,
		TicketDueDateModule
	],
	controllers: [TestController],
	providers: [],
})
export class AppModule { }
