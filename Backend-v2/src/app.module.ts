import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { TestController } from './test/test.controller';

@Module({
	imports: [GlobalModule],
	controllers: [TestController],
	providers: [],
})
export class AppModule { }
