import { Body, Controller, Get, Patch } from '@nestjs/common';
import { User as TUser } from '@prisma/client';
import { User } from '@src/global/auth/auth.user.decorator';
import { PrismaService } from '@src/global/database/database.prisma.service';
import { UpdateUserSettingsDto } from "./user-setting.dtos";

@Controller('userSettings')
export class UserSettingsController {

	constructor(
		private prisma: PrismaService
	) { }

	@Get()
	async find(
		@User() requestUser: TUser
	) {

		const { prisma } = this;

		const userSettings = await prisma.userSettings.findFirst({
			where: {
				userId: requestUser.id
			}
		});

		return userSettings;
	}

	@Patch()
	async update(
		@User() requestUser: TUser,
		@Body() updateUserSettingsDto: UpdateUserSettingsDto
	) {

		const { prisma } = this;

		const updatedUserSettings = await prisma.userSettings.update({
			where: {
				userId: requestUser.id
			},
			data: updateUserSettingsDto
		})

		return updatedUserSettings;
	}
}
