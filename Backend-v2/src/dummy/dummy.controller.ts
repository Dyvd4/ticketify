import { Body, Controller, Get, Options, ParseArrayPipe, Post, Put, Query, Req } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
import { PrismaService } from "@src/global/database/database.prisma.service";
import { ValidationException } from "@src/global/global.validation.exception";
import { InfiniteLoader } from "@src/lib/list";
import { FilterQueryParams, getMappedPrismaFilterArgs, getMappedPrismaOrderByArgs, OrderByQueryParams } from "@src/lib/list/list";
import { InfiniteLoaderQueryDto } from "@src/lib/list/list.dtos";
import { MailTemplateProvider } from "@src/mail/mail.template-provider";
import { DummyDto, SomeObjDto } from "./dummy.dtos";

@Controller('dummy')
export class DummyController {

	constructor(
		private mailTemplateProvider: MailTemplateProvider,
		private prisma: PrismaService
	) { }

	@Get('getTiddies')
	tiddies() {
		return "Gimme them";
	}

	@Get('getHtmlTemplate')
	async getHtmlTemplate() {
		const user = {
			firstName: "David",
			lastName: "Kimmich"
		}
		const html = await this.mailTemplateProvider.getInjectedHtmlFromFile("Test", { user });
		return html;
	}

	@Get("getWithObjectUrlParams")
	getWithObjectUrlParams(
		@Query() someObj: SomeObjDto
	) {
		return someObj;
	}

	@Get("getWithArrayParams")
	getWithArrayParams(
		@Query("excludeIds", new ParseArrayPipe({ items: Number, optional: true })) excludeIds: number[] = []
	) {
		return excludeIds;
	}

	@Get("test")
	async getTestEntities(
		@Query() query: InfiniteLoaderQueryDto
	) {
		const { prisma } = this;
		const pager = new InfiniteLoader(query, 5);

		const testItems = await prisma.test.findMany({
			...pager.getPrismaArgs(),
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});
		const testItemsCount = await prisma.test.count({
			where: pager.getPrismaFilterArgs(),
			orderBy: pager.getPrismaOrderByArgs()
		});

		return pager.getResult(testItems, testItemsCount);
	}

	@Get('test/woPager')
	async getTestEntitiesWithoutPager(@Req() req: any) {

		const { prisma } = this;

		const testItems = await prisma.test.findMany({
			where: getMappedPrismaFilterArgs(req.query.filter as FilterQueryParams),
			orderBy: getMappedPrismaOrderByArgs(req.query.orderBy as OrderByQueryParams)
		});

		return testItems;
	}


	@Get("error")
	getError() {
		throw new BadRequestException();
	}

	@Post("error")
	postError(@Body() dummyDto: DummyDto) {
		return new ValidationException("some dumb error");
	}

	@Put("dumbShit")
	someDumbShit() {
		return "Hello"
	}
}