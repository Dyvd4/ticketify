import { Auth } from "@auth/auth.decorator";
import { AuthMailDeliveryService } from "@auth/auth.mail-delivery.service";
import { User } from "@auth/auth.user.decorator";
import { PrismaService } from "@database/database.prisma.service";
import { Controller, Get, NotFoundException, NotImplementedException, Param } from "@nestjs/common";
import { Body, Put } from "@nestjs/common/decorators";
import { ApiCookieAuth, ApiParam } from "@nestjs/swagger";
import { User as TUser } from "@prisma/client";
import { ValidationException } from "@src/global/global.validation.exception";
import bcrypt from "bcrypt";
import { PrismaFileToClientFileMap } from "@src/file/maps/file.prisma-file-to-client.map";
import { NewPasswordDto, UpdateEmailDto, UpdateUsernameDto } from "./user.dtos";

@Controller()
@ApiCookieAuth()
export class UserController {

	constructor(
		private prisma: PrismaService,
		private authMailDeliveryService: AuthMailDeliveryService
	) { }

	@Get('users')
	async getUsers() {
		const { prisma } = this;

		const users = await prisma.user.findMany();

		return {
			items: users
		};
	}

	@Auth({
		ignoreEmailConfirmation: true
	})
	// ApiParam decorator is only for swagger UI
	// optional parameter works with question mark only just fine
	@ApiParam({
		name: "id",
		required: false
	})
	@Get("user/:id?/all")
	async getUserWithAllIncluded(
		@User() requestUser: TUser,
		@Param("id") id?: string
	) {

		const { prisma } = this;

		const user = await prisma.user.findFirst({
			where: {
				id: id || requestUser.id
			},
			include: {
				avatar: {
					include: {
						file: true
					}
				},
				watchingTickets: {
					include: {
						ticket: true
					}
				}
			}
		});

		if (!user) {
			throw new NotFoundException(null)
		}

		(user as any).avatar = user.avatar?.file
			? PrismaFileToClientFileMap(user.avatar.file)
			: null;

		return user;
	}

	@Auth({
		ignoreEmailConfirmation: true
	})
	@ApiParam({
		name: "id",
		required: false
	})
	@Get('user/:id?')
	async getUser(
		@User() requestUser: TUser,
		@Param("id") id?: string
	) {
		const { prisma } = this;

		const user = await prisma.user.findFirst({
			where: {
				id: id || requestUser.id
			}
		});

		if (!user) {
			throw new NotFoundException(null)
		}

		return user;
	}

	@Put('user/username')
	async updateUsername(
		@User() requestUser: TUser,
		@Body() { username }: UpdateUsernameDto
	) {

		const { prisma } = this;

		const existingUsername = await prisma.user.findFirst({
			where: {
				username
			}
		});

		if (existingUsername && username !== requestUser.username) {
			throw new ValidationException(`User with name: ${username} already existing`);
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: requestUser.id
			},
			data: {
				username
			}
		});

		return updatedUser;
	}

	@Auth({
		ignoreEmailConfirmation: true
	})
	@Put('user/email')
	async updateEmail(
		@User() requestUser: TUser,
		@Body() { email }: UpdateEmailDto
	) {

		const { prisma } = this;

		const existingEmail = await prisma.user.findFirst({
			where: {
				email
			}
		});

		const isSameEmail = email === requestUser.email;

		if (existingEmail && !isSameEmail) {
			throw new ValidationException(`E-mail: ${email} already existing`);
		}

		if (isSameEmail) return "Your e-mail is already equal to the provided value";

		const updatedUser = await prisma.user.update({
			where: {
				id: requestUser.id
			},
			data: {
				email,
				emailConfirmed: false
			}
		});

		if (!isSameEmail) this.authMailDeliveryService.sendEmailConfirmationEmail(updatedUser);

		return updatedUser;
	}

	@Put('user/newPassword')
	async updatePassword(
		@User() requestUser: TUser,
		@Body() passwordData: NewPasswordDto
	) {

		const { prisma } = this;

		if (!(await bcrypt.compare(passwordData.currentPassword, requestUser.password))) {
			throw new ValidationException("Current password is not valid")
		}

		if (passwordData.newPassword !== passwordData.repeatedNewPassword) {
			throw new ValidationException("passwords are not equal")
		}

		const newPassword = await bcrypt.hash(passwordData.newPassword, 10);
		const updatedUser = await prisma.user.update({
			where: {
				id: requestUser.id
			},
			data: {
				password: newPassword
			}
		});

		return updatedUser;
	}

	// TODO: s3 upload
	@Put('user/avatar')
	async updateAvatar(
		@User() requestUser: TUser
	) {
		throw new NotImplementedException();
	}
}