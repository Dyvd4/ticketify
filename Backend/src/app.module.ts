import { Module } from "@nestjs/common";
import { CommentModule } from "./modules/comment/comment.module";
import { CompanyModule } from "./modules/company/company.module";
import { DummyModule } from "./modules/dummy/dummy.module";
import { FileModule } from "./modules/file/file.module";
import { GlobalModule } from "./modules/global/global.module";
import { TicketModule } from "./modules/ticket/ticket.module";
import { UserModule } from "./modules/user/user.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ScheduleModule as ScheduleModuleImplementation } from "./modules/schedule/schedule.module";

@Module({
	imports: [
		GlobalModule,
		UserModule,
		CommentModule,
		TicketModule,
		DummyModule,
		FileModule,
		CompanyModule,
		ScheduleModule.forRoot(),
		ScheduleModuleImplementation,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
