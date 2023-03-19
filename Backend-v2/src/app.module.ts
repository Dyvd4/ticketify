import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { GlobalModule } from './global/global.module';
import { TestController } from './test/test.controller';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
	imports: [
		GlobalModule,
		UserModule,
		CommentModule,
		TicketModule,
		UserSettingsModule
	],
	controllers: [TestController],
	providers: [],
})
export class AppModule { }
