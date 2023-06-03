import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "@src/modules/global/database/prisma.service";

@Controller()
export class UserRoleController {
	constructor(private prisma: PrismaService) {}

	@Get("user-roles")
	async find() {
		const { prisma } = this;

		const userRoles = await prisma.userRole.findMany();
		return userRoles;
	}
}
