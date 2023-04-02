import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { TicketActivityPrismaMiddleWareProvider } from '@src/ticket/ticket-activity/ticket-activity-prisma-middleware.provider';
import { TicketActivityModule } from '@src/ticket/ticket-activity/ticket-activity.module';
import { PrismaService } from './database.prisma.service';

@Module({
	imports: [TicketActivityModule],
	providers: [PrismaService],
	controllers: [],
	exports: [PrismaService]
})
export class DatabaseModule implements OnModuleInit {
	constructor(
		private moduleRef: ModuleRef,
		private ticketActivityMiddleWareProvider: TicketActivityPrismaMiddleWareProvider
	) { }
	onModuleInit() {
		const prismaService = this.moduleRef.get(PrismaService);

		const {
			createActivityByComment,
			createActivityIfDescriptionHasChanged,
			createActivityIfStatusHasChanged,
			createActivityIfResponsibleUserHasChanged
		} = this.ticketActivityMiddleWareProvider;

		prismaService.$use(createActivityByComment);
		prismaService.$use(createActivityIfDescriptionHasChanged);
		prismaService.$use(createActivityIfStatusHasChanged);
		prismaService.$use(createActivityIfResponsibleUserHasChanged);
	}
}
