import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { GlobalModule } from './global/global.module';
import { DummyModule } from './dummy/dummy.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';

@Module({
	imports: [
		GlobalModule,
		UserModule,
		CommentModule,
		TicketModule,
		DummyModule,
		FileModule
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
