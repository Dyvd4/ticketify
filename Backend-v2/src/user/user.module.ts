import { Module } from "@nestjs/common/decorators";
import { FileModule } from "@src/file/file.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [
		UserSettingsModule,
		FileModule
	],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule { }