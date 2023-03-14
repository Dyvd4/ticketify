import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Config } from 'src/config';
import { PrismaService } from '@database/database.prisma.service';
import { Auth } from './auth.decorator';
import { AuthMailDeliveryService } from './auth.mail-delivery.service';
import { UserSignInDto, UserSignUpDto } from './auth.user.dtos';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import dayjs from 'dayjs';

@Auth({
	disable: true
})
@Controller('auth')
export class AuthController {

	private JWT_SECRET_KEY: string

	constructor(
		private prisma: PrismaService,
		private authMailDeliveryService: AuthMailDeliveryService,
		configService: ConfigService
	) {
		this.JWT_SECRET_KEY = configService.get<Config>("JWT_SECRET_KEY", { infer: true })
	}

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
			throw new BadRequestException(`User with name: ${username} not existing`);
		}

		if (!(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException(`Password or username is invalid`);
		}

		const authToken = jwt.sign({
			data: {
				userId: user.id
			}
		}, this.JWT_SECRET_KEY);

		return response
			.status(201)
			.cookie("auth-token", authToken, {
				expires: dayjs().add(7, "day").toDate()
			})
			.send();
	}

	@Post('signUp')
	async signUp(
		@Body() { username, password, email }: UserSignUpDto,
	) {
		const { prisma } = this;

		const existingUsername = await prisma.user.findFirst({
			where: {
				username
			}
		});

		if (existingUsername) {
			throw new BadRequestException(`User with name: ${username} already existing`)
		}

		const existingEmail = await prisma.user.findFirst({
			where: {
				email
			}
		});

		if (existingEmail) {
			throw new BadRequestException(`Email: ${email} already existing`);
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

		return {
			message: "Successfully created user",
			authToken
		};
	}
}
