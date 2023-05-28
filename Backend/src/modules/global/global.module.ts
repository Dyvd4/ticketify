import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import config from "src/config";
import { LogModule } from "../log/log.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config],
		}),
		AuthModule,
		DatabaseModule,
		LogModule,
	],
	providers: [],
	exports: [AuthModule, DatabaseModule, LogModule],
})
export class GlobalModule {}
