import { Module } from "@nestjs/common/decorators";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { UserController } from "./user.controller";

@Module({
	imports: [UserSettingsModule],
	providers: [],
	controllers: [UserController],
	exports: []
})
export class UserModule { }