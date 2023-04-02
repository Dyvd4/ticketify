import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from "src/config";
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config]
		}),
		AuthModule,
		DatabaseModule
	],
	providers: [],
	exports: [AuthModule, DatabaseModule]
})
export class GlobalModule { }
