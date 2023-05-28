import { Module, OnModuleInit } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { TicketActivityPrismaMiddleWareProvider } from "@src/modules/ticket/ticket-activity/ticket-activity-prisma-middleware.provider";
import { TicketActivityModule } from "@src/modules/ticket/ticket-activity/ticket-activity.module";
import { UserModule } from "@src/modules/user/user.module";
import { UserPrismaMiddleWareProvider } from "@src/modules/user/user-prisma-middleware.provider";
import { PrismaService } from "./prisma.service";

@Module({
	imports: [TicketActivityModule, UserModule],
	providers: [PrismaService],
	controllers: [],
	exports: [PrismaService],
})
export class DatabaseModule implements OnModuleInit {
	constructor(
		private moduleRef: ModuleRef,
		private ticketActivityMiddleWareProvider: TicketActivityPrismaMiddleWareProvider,
		private userMiddlewareProvider: UserPrismaMiddleWareProvider
	) {}
	onModuleInit() {
		const prismaService = this.moduleRef.get(PrismaService);

		const {
			createActivityByComment,
			createActivityIfDescriptionHasChanged,
			createActivityIfStatusHasChanged,
			createActivityIfResponsibleUserHasChanged,
		} = this.ticketActivityMiddleWareProvider;

		const { userSignature } = this.userMiddlewareProvider;

		prismaService.$use(createActivityByComment);
		prismaService.$use(createActivityIfDescriptionHasChanged);
		prismaService.$use(createActivityIfStatusHasChanged);
		prismaService.$use(createActivityIfResponsibleUserHasChanged);
		prismaService.$use(userSignature);
	}
}
