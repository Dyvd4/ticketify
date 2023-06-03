import { Controller, Get, NotFoundException, Param, UnauthorizedException } from "@nestjs/common";
import { Body, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiParam } from "@nestjs/swagger";
import { User as TUser } from "@prisma/client";
import { InfiniteLoader } from "@src/lib/list";
import { InfiniteLoaderQueryDto } from "@src/lib/list/list.dtos";
import ListResult from "@src/lib/list/result/list-result";
import { UploadFileDto } from "@src/modules/file/file.dtos";
import { parseImageFilePipe } from "@src/modules/file/file.pipes";
import { FileService } from "@src/modules/file/file.service";
import { AuthMailDeliveryService } from "@src/modules/global/auth/auth-mail-delivery.service";
import { Auth, ROLE_NAME } from "@src/modules/global/auth/auth.decorator";
import { User } from "@src/modules/global/auth/user.decorator";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { ValidationException } from "@src/modules/global/validation.exception";
import bcrypt from "bcrypt";
import { NewPasswordDto, UpdateEmailDto, UpdateUsernameDto, UpdateUserRoleDto } from "./user.dtos";

@Controller()
@ApiCookieAuth()
export class UserController {
	constructor(
		private prisma: PrismaService,
		private authMailDeliveryService: AuthMailDeliveryService,
		private fileService: FileService
	) {}

	@Get("users")
	async getUsers() {
		const { prisma } = this;

		const users = await prisma.user.findMany();

		return new ListResult(users);
	}
	@Get("users-with-avatar")
	async getUsersWithAvatar(@Query() query: InfiniteLoaderQueryDto) {
		const { prisma } = this;

		const infiniteLoader = new InfiniteLoader(query);

		const users = await prisma.user.findMany({
			...infiniteLoader.getPrismaArgs(),
			where: infiniteLoader.getPrismaFilterArgs(),
			orderBy: infiniteLoader.getPrismaOrderByArgs(),
			include: {
				avatar: {
					include: {
						file: true,
					},
				},
				role: true,
			},
		});
		const itemsCount = await prisma.user.count({
			where: infiniteLoader.getPrismaFilterArgs(),
			orderBy: infiniteLoader.getPrismaOrderByArgs(),
		});
		await Promise.all(
			users.map((user) => {
				return (async () => {
					if (user.avatar?.file) {
						user.avatar.file = await this.fileService.getFileWithSignedUrl(
							user.avatar.file
						);
					}
				})();
			})
		);

		return infiniteLoader.getResult(users, itemsCount);
	}

	@Auth({
		ignoreEmailConfirmation: true,
	})
	// ApiParam decorator is only for swagger UI
	// optional parameter works with question mark only just fine
	@ApiParam({
		name: "id",
		required: false,
	})
	@Get("user/:id?/all")
	async getUserWithAllIncluded(@User() requestUser: TUser, @Param("id") id?: string) {
		const { prisma } = this;

		const user = await prisma.user.findFirst({
			where: {
				id: id || requestUser.id,
			},
			include: {
				avatar: {
					include: {
						file: true,
					},
				},
				watchingTickets: {
					include: {
						ticket: true,
					},
				},
				role: true,
			},
		});

		if (!user) {
			throw new NotFoundException(null);
		}

		(user as any).avatar = user.avatar?.file
			? await this.fileService.getFileWithSignedUrl(user.avatar.file)
			: null;

		return user;
	}

	@Auth({
		ignoreEmailConfirmation: true,
	})
	@ApiParam({
		name: "id",
		required: false,
	})
	@Get("user/:id?")
	async getUser(@User() requestUser: TUser, @Param("id") id?: string) {
		const { prisma } = this;

		const user = await prisma.user.findFirst({
			where: {
				id: id || requestUser.id,
			},
		});

		if (!user) {
			throw new NotFoundException(null);
		}

		return user;
	}

	@Put("user/username")
	async updateUsername(@User() requestUser: TUser, @Body() { username }: UpdateUsernameDto) {
		const { prisma } = this;

		const existingUsername = await prisma.user.findFirst({
			where: {
				username,
			},
		});

		if (existingUsername && username !== requestUser.username) {
			throw new ValidationException(`User with name: ${username} already existing`);
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: requestUser.id,
			},
			data: {
				username,
			},
		});

		return updatedUser;
	}

	@Auth({
		ignoreEmailConfirmation: true,
	})
	@Put("user/email")
	async updateEmail(@User() requestUser: TUser, @Body() { email }: UpdateEmailDto) {
		const { prisma } = this;

		const existingEmail = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		const isSameEmail = email === requestUser.email;

		if (existingEmail && !isSameEmail) {
			throw new ValidationException(`E-mail: ${email} already existing`);
		}

		if (isSameEmail) return "Your e-mail is already equal to the provided value";

		const updatedUser = await prisma.user.update({
			where: {
				id: requestUser.id,
			},
			data: {
				email,
				emailConfirmed: false,
			},
		});

		if (!isSameEmail) this.authMailDeliveryService.sendEmailConfirmationEmail(updatedUser);

		return updatedUser;
	}

	@Put("user/newPassword")
	async updatePassword(@User() requestUser: TUser, @Body() passwordData: NewPasswordDto) {
		const { prisma } = this;

		if (!(await bcrypt.compare(passwordData.currentPassword, requestUser.password))) {
			throw new ValidationException("Current password is not valid");
		}

		if (passwordData.newPassword !== passwordData.repeatedNewPassword) {
			throw new ValidationException("passwords are not equal");
		}

		const newPassword = await bcrypt.hash(passwordData.newPassword, 10);
		const updatedUser = await prisma.user.update({
			where: {
				id: requestUser.id,
			},
			data: {
				password: newPassword,
			},
		});

		return updatedUser;
	}

	@ApiConsumes("multipart/form-data")
	@ApiBody({
		type: UploadFileDto,
	})
	@Put("user/avatar")
	@UseInterceptors(FileInterceptor("file"))
	async updateAvatar(
		@User() requestUser: TUser,
		@UploadedFile(parseImageFilePipe) file: Express.Multer.File
	) {
		const createdOrUpdatedFile = await this.fileService.createOrUpdateFile(file);

		const updatedUser = await this.prisma.user.update({
			where: {
				id: requestUser.id,
			},
			data: {
				avatar: {
					upsert: {
						create: {
							fileId: createdOrUpdatedFile.id,
						},
						update: {
							fileId: createdOrUpdatedFile.id,
						},
					},
				},
			},
		});

		return updatedUser;
	}

	@ApiParam({
		name: "id",
		required: false,
	})
	@Auth({ roleName: "admin" })
	@Put("user/:id?/role")
	async updateUserRole(
		@User() requestUser: TUser,
		@Body() { roleId }: UpdateUserRoleDto,
		@Param("id") id?: string
	) {
		const { prisma } = this;

		const superAdminRole = await prisma.userRole.findUnique({
			where: {
				name: ROLE_NAME["super-admin"],
			},
		});

		if (roleId === superAdminRole!.id) {
			throw new UnauthorizedException("You cannot assign yourself the super-admin role");
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: id || requestUser.id,
			},
			data: {
				roleId,
			},
		});

		return updatedUser;
	}
}
