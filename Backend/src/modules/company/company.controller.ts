import { Controller, Get, Param, Query } from "@nestjs/common";
import { InfiniteLoader } from "@src/lib/list";
import { InfiniteLoaderQueryDto } from "@src/lib/list/list.dtos";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { FileService } from "../file/file.service";

@Controller()
export class CompanyController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService
	) {}

	@Get("company/:id/tickets")
	async getTickets(@Param("id") id: string, @Query() query: InfiniteLoaderQueryDto) {
		const { prisma } = this;
		const infiniteLoader = new InfiniteLoader(query);
		const employeeIds = (
			await prisma.user.findMany({
				...infiniteLoader.getPrismaArgs(),
				where: {
					companyId: id,
				},
				select: {
					id: true,
				},
			})
		).map((e) => e.id);

		const tickets = await prisma.ticket.findMany({
			...infiniteLoader.getPrismaArgs(),
			where: {
				responsibleUserId: {
					in: employeeIds,
				},
			},
			include: {
				priority: true,
				status: true,
				responsibleUser: true,
			},
		});
		const ticketsCount = await prisma.ticket.count({
			...infiniteLoader.getPrismaArgs(),
		});
		return infiniteLoader.getResult(tickets, ticketsCount);
	}

	@Get("companies-with-avatar")
	async getCompanies(@Query() query: InfiniteLoaderQueryDto) {
		const { prisma } = this;
		const infiniteLoader = new InfiniteLoader(query);

		const companies = await prisma.company.findMany({
			...infiniteLoader.getPrismaArgs(),
			where: infiniteLoader.getPrismaFilterArgs(),
			orderBy: infiniteLoader.getPrismaOrderByArgs(),
			include: {
				avatar: {
					include: {
						file: true,
					},
				},
			},
		});
		const companiesCount = await prisma.company.count({
			where: infiniteLoader.getPrismaFilterArgs(),
			orderBy: infiniteLoader.getPrismaOrderByArgs(),
		});

		await Promise.all(
			companies.map((user) => {
				return (async () => {
					if (user.avatar?.file) {
						user.avatar.file = await this.fileService.getFileWithSignedUrl(
							user.avatar.file
						);
					}
				})();
			})
		);

		return infiniteLoader.getResult(companies, companiesCount);
	}
	@Get("company/:id/employees")
	async getEmployees(@Param("id") id: string, @Query() query: InfiniteLoaderQueryDto) {
		const { prisma } = this;

		const infiniteLoader = new InfiniteLoader(query);
		const employees = await prisma.user.findMany({
			...infiniteLoader.getPrismaArgs(),
			where: {
				companyId: id,
			},
		});

		const employeesCount = await prisma.user.count({
			...infiniteLoader.getPrismaArgs(),
		});

		return infiniteLoader.getResult(employees, employeesCount);
	}
	@Get("company/:id")
	async getCompany(@Param("id") id: string) {
		const { prisma } = this;

		const company = await prisma.company.findUnique({
			where: {
				id,
			},
		});

		return company;
	}
}
