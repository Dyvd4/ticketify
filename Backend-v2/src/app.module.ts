import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [GlobalModule, ConfigModule.forRoot()],
	controllers: [],
	providers: [],
})
export class AppModule { }
