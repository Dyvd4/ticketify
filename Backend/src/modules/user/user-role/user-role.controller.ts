import { Controller, Get } from "@nestjs/common";
import ListResult from "@src/lib/list/result/list-result";
import { ROLE_NAME } from "@src/modules/global/auth/auth.decorator";
import { PrismaService } from "@src/modules/global/database/prisma.service";

@Controller()
export class UserRoleController {
	constructor(private prisma: PrismaService) {}

	@Get("user-roles")
	async find() {
		const { prisma } = this;

		const superAdminRole = await prisma.userRole.findUnique({
			where: {
				name: ROLE_NAME["super-admin"],
			},
		});

		const userRoles = await prisma.userRole.findMany({
			where: {
				id: {
					not: superAdminRole!.id,
				},
			},
		});
		return new ListResult(userRoles);
	}
}
