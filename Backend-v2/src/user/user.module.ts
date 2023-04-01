import { Module } from "@nestjs/common/decorators";
import { FileModule } from "@src/file/file.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { UserController } from "./user.controller";

@Module({
	imports: [
		UserSettingsModule,
		FileModule
	],
	providers: [],
	controllers: [UserController],
	exports: []
})
export class UserModule { }