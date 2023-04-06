import { Module } from '@nestjs/common';
import { CommentModule } from './modules/comment/comment.module';
import { DummyModule } from './modules/dummy/dummy.module';
import { FileModule } from './modules/file/file.module';
import { GlobalModule } from './modules/global/global.module';
import { LogModule } from './modules/log/log.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [
		GlobalModule,
		UserModule,
		CommentModule,
		TicketModule,
		DummyModule,
		FileModule,
		LogModule
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
