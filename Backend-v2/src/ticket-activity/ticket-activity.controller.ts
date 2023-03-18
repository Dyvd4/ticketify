import { PrismaService } from '@database/database.prisma.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { InfiniteLoader } from "@src/lib/list";
import { FindAllQueryDto } from './ticket-activity.dtos';

@Controller()
export class TicketActivityController {

	constructor(private readonly prisma: PrismaService) { }

	@Get('ticketActivities')
	async findAll(
		// TODO: test query with client
		@Query() { ticketId, ...query }: FindAllQueryDto,
	) {

		const { prisma } = this;

		const infiniteLoader = new InfiniteLoader(query);
		const ticketActivities = await prisma.ticketActivity.findMany({
			...infiniteLoader.getPrismaArgs(),
			include: {
				ticket: true,
				createdFrom: true,
			},
			orderBy: {
				createdAt: "desc"
			},
			where: {
				ticketId: ticketId
					? ticketId
					: undefined
			}
		});

		const ticketActivitiesCount = await prisma.ticketActivity.count({
			where: {
				ticketId: ticketId
					? ticketId
					: undefined
			}
		});

		return infiniteLoader.getResult(ticketActivities, ticketActivitiesCount);
	}

	@Get('ticketActivity/:id')
	async findOne(@Param('id') id: string) {

		const { prisma } = this;

		const ticketActivity = await prisma.ticketActivity.findFirst({
			where: {
				id
			},
			include: {
				ticket: true,
				createdFrom: true
			}
		});

		return ticketActivity;
	}
}
