import { Module } from "@nestjs/common/decorators";
import { FileModule } from "@src/modules/file/file.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { UserController } from "./user.controller";
import { UserPrismaMiddleWareProvider } from "./user-prisma-middleware.provider";
import { UserService } from "./user.service";
import { UserRoleModule } from "./user-role/user-role.module";

@Module({
	imports: [UserSettingsModule, FileModule, UserRoleModule],
	providers: [UserService, UserPrismaMiddleWareProvider],
	controllers: [UserController],
	exports: [UserService, UserPrismaMiddleWareProvider],
})
export class UserModule {}
