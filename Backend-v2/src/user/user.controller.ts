import { Auth } from "@auth/auth.decorator";
import { AuthMailDeliveryService } from "@auth/auth.mail-delivery.service";
import { User } from "@auth/auth.user.decorator";
import { PrismaService } from "@database/database.prisma.service";
import { BadRequestException, Controller, Get, NotFoundException, NotImplementedException, Param } from "@nestjs/common";
import { Body, Put } from "@nestjs/common/decorators";
import { ApiCookieAuth, ApiParam } from "@nestjs/swagger";
import { User as TUser } from "@prisma/client";
import bcrypt from "bcrypt";
import FileEntityToClientDto from "src/file/file.dtos";
import { NewPasswordDto, UpdateEmailDto, UpdateUsernameDto } from "./user.dtos";

@Controller("user")
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
	@Get(":id?/all")
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
			? FileEntityToClientDto(user.avatar.file)
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
	@Get(':id?')
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

	@Put('username')
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
			throw new BadRequestException({
				validation: {
					message: `User with name: ${username} already existing`
				}
			});
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
	@Put('email')
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
			throw new BadRequestException({
				validation: {
					message: `E-mail: ${email} already existing`
				}
			});
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

	@Put('newPassword')
	async updatePassword(
		@User() requestUser: TUser,
		@Body() passwordData: NewPasswordDto
	) {

		const { prisma } = this;

		if (!(await bcrypt.compare(passwordData.currentPassword, requestUser.password))) {
			throw new BadRequestException({
				validation: {
					message: "Current password is not valid"
				}
			})
		}

		if (passwordData.newPassword !== passwordData.repeatedNewPassword) {
			throw new BadRequestException({
				validation: {
					message: "passwords are not equal"
				}
			})
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
	@Put('avatar')
	async updateAvatar(
		@User() requestUser: TUser
	) {
		throw new NotImplementedException();
	}
}