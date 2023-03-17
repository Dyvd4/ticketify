import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { GlobalModule } from './global/global.module';
import { TestController } from './test/test.controller';
import { UserModule } from './user/user.module';

@Module({
	imports: [GlobalModule, UserModule, CommentModule],
	controllers: [TestController],
	providers: [],
})
export class AppModule { }
