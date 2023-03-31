import { PrismaService } from '@database/database.prisma.service';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User as TUser } from '@prisma/client';
import bcrypt from "bcrypt";
import dayjs from 'dayjs';
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { Config } from 'src/config';
import { ValidationException } from '../global.validation.exception';
import { Auth } from './auth.decorator';
import { AuthMailDeliveryService } from './auth.mail-delivery.service';
import { User } from './auth.user.decorator';
import { UserSignInDto, UserSignUpDto } from './auth.user.dtos';

@Controller('auth')
export class AuthController {

	private JWT_SECRET_KEY: string
	private CLIENT_URL: string

	constructor(
		private prisma: PrismaService,
		private authMailDeliveryService: AuthMailDeliveryService,
		configService: ConfigService
	) {
		this.JWT_SECRET_KEY = configService.get<Config>("JWT_SECRET_KEY", { infer: true })
		this.CLIENT_URL = configService.get<Config>("CLIENT_URL", { infer: true })
	}

	@Auth({
		disable: true
	})
	@Post('signIn')
	async signIn(
		@Body() { username, password }: UserSignInDto,
		@Res() response: Response
	) {
		const { prisma } = this;

		const user = await prisma.user.findFirst({
			where: {
				username
			}
		});

		if (!user) {
			throw new ValidationException(`User with name: ${username} not existing`);
		}

		if (!(await bcrypt.compare(password, user.password))) {
			throw new ValidationException(`Password or username is invalid`);
		}

		const authToken = jwt.sign({
			data: {
				userId: user.id
			}
		}, this.JWT_SECRET_KEY);

		return response
			.status(201)
			.cookie("auth-token", authToken, {
				expires: dayjs().add(7, "day").toDate(),
				sameSite: "none",
				secure: true
			})
			.json({
				message: "Successfully signed in",
				authToken
			})
	}

	@Auth({
		disable: true
	})
	@Post('signUp')
	async signUp(
		@Body() { username, password, email }: UserSignUpDto,
		@Res() response: Response
	) {
		const { prisma } = this;

		const existingUsername = await prisma.user.findFirst({
			where: {
				username
			}
		});

		if (existingUsername) {
			throw new ValidationException(`User with name: ${username} already existing`)
		}

		const existingEmail = await prisma.user.findFirst({
			where: {
				email
			}
		});

		if (existingEmail) {
			throw new ValidationException(`Email: ${email} already existing`);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				settings: {
					create: {}
				}
			}
		});

		const authToken = jwt.sign({
			data: {
				userId: user.id
			}
		}, this.JWT_SECRET_KEY);

		this.authMailDeliveryService.sendEmailConfirmationEmail(user);

		return response
			.status(201)
			.cookie("auth-token", authToken, {
				expires: dayjs().add(7, "day").toDate(),
				sameSite: "none",
				secure: true
			})
			.json({
				message: "Successfully created user",
				authToken
			});
	}

	@Auth({
		disable: true
	})
	@Post('signOut')
	async signOut(@Res() res: Response) {
		return res
			.status(201)
			.clearCookie("auth-token", {
				sameSite: "none",
				secure: true
			})
			.json("Sent cookie header that expires instantly in order to sign out")
	}

	@Auth({
		ignoreEmailConfirmation: true
	})
	@Post('confirmEmail')
	async createConfirmationEmail(
		@User() requestUser: TUser
	) {
		const { prisma } = this;

		const user = await prisma.user.findFirst({
			where: {
				id: requestUser.id
			}
		});

		await this.authMailDeliveryService.sendEmailConfirmationEmail(user!);

		return "Successfully sent e-mail";
	}

	@Auth({
		ignoreEmailConfirmation: true
	})
	@Get('confirmEmail/:redirectToken')
	async confirmConfirmationEmail(
		@Param("redirectToken") redirectToken: string,
		@Res() res: Response
	) {
		const { prisma, JWT_SECRET_KEY, CLIENT_URL } = this;
		const { data: { userId } } = jwt.verify(redirectToken, JWT_SECRET_KEY) as { data: { userId: string } };

		await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				emailConfirmed: true
			}
		});

		return res.redirect(`${CLIENT_URL}/Auth/EmailConfirmed`);
	}
}
