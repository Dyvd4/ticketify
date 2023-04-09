import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Pager } from '@src/lib/list';
import { PagerQueryDto } from '@src/lib/list/list.dtos';
import { PrismaService } from '../global/database/prisma.service';
import { CreateErrorLogDto } from './log.dtos';
import { LogService } from './log.service';

@Controller()
export class LogController {

	constructor(
		private readonly prisma: PrismaService,
		private readonly logService: LogService
	) { }

	@Post('log/error')
	async createErrorLog(@Body() { error }: CreateErrorLogDto) {
		this.logService.error(`${error.name}: ${error.message}`, error.stack, "Client");
		return {
			message: "Successfully saved error"
		};
	}

	@Get('logs')
	async getLogs(@Query() query: PagerQueryDto) {
		const { prisma } = this;

		const pager = new Pager(query, 3);

		const items = await prisma.log.findMany({
			...pager.getPrismaArgs(),
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});
		const itemsCount = await prisma.log.count({
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});

		return pager.getResult(items, itemsCount);
	}

	@Get('logs/count')
	async getLogCount() {
		const { prisma } = this;
		const logCount = await prisma.log.count();
		return logCount;
	}
}