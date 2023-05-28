import { PrismaService } from "@src/modules/global/database/prisma.service";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import { InfiniteLoader } from "@src/lib/list";
import { InfiniteLoaderQueryDto } from "@src/lib/list/list.dtos";

@Controller()
export class TicketActivityController {
	constructor(private readonly prisma: PrismaService) {}

	@ApiParam({
		name: "ticketId",
		required: false,
	})
	@Get("ticketActivities/:ticketId?")
	async findAll(@Param("ticketId") ticketId: number, @Query() query: InfiniteLoaderQueryDto) {
		const { prisma } = this;

		const infiniteLoader = new InfiniteLoader(query);
		const ticketActivities = await prisma.ticketActivity.findMany({
			...infiniteLoader.getPrismaArgs(),
			include: {
				ticket: true,
				createdFrom: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			where: {
				ticketId: ticketId ? ticketId : undefined,
			},
		});

		const ticketActivitiesCount = await prisma.ticketActivity.count({
			where: {
				ticketId: ticketId ? ticketId : undefined,
			},
		});

		return infiniteLoader.getResult(ticketActivities, ticketActivitiesCount);
	}

	@Get("ticketActivity/:id")
	async findOne(@Param("id") id: string) {
		const { prisma } = this;

		const ticketActivity = await prisma.ticketActivity.findFirst({
			where: {
				id,
			},
			include: {
				ticket: true,
				createdFrom: true,
			},
		});

		return ticketActivity;
	}
}
