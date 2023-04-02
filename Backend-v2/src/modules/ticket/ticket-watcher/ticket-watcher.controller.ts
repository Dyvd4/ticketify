import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@src/config';
import { PrismaService } from '@src/modules/global/database/database.prisma.service';
import { ValidationException } from '@src/modules/global/global.validation.exception';
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { CreateTicketWatcherDto } from './ticket-watcher.dtos';

@Controller("ticketWatcher")
export class TicketWatcherController {

	private JWT_SECRET_KEY: string
	private CLIENT_URL: string

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {
		this.JWT_SECRET_KEY = this.configService.get<Config>("JWT_SECRET_KEY", { infer: true });
		this.CLIENT_URL = this.configService.get<Config>("CLIENT_URL", { infer: true });
	}

	// TODO: test when ticket-activity middleware is implemented
	@Get("unwatch/:encodedUserId/:ticketId")
	async unwatch(
		@Param("ticketId") ticketId: number,
		@Param("encodedUserId") encodedUserId: string,
		@Res() res: Response
	) {
		const { prisma, JWT_SECRET_KEY, CLIENT_URL } = this;
		const { data: { userId } } = jwt.verify(encodedUserId, JWT_SECRET_KEY) as { data: { userId: string } };

		await prisma.ticketWatcher.delete({
			where: {
				userId_ticketId: {
					userId,
					ticketId: ticketId
				}
			}
		});

		res.redirect(`${CLIENT_URL}/Ticket/Details/${ticketId}`);
	}

	@Post()
	async create(@Body() createTicketWatcherDto: CreateTicketWatcherDto) {

		const { prisma } = this;

		const ticketWatcherExisting = await prisma.ticketWatcher.findUnique({
			where: {
				userId_ticketId: createTicketWatcherDto
			}
		});

		if (ticketWatcherExisting) {
			throw new ValidationException("ticket watcher already existing");
		}

		const newTicketWatcher = await prisma.ticketWatcher.create({
			data: createTicketWatcherDto
		});

		return newTicketWatcher;
	}

	@Delete(':userId/:ticketId')
	async remove(
		@Param('userId') userId: string,
		@Param('ticketId') ticketId: number
	) {

		const { prisma } = this;

		const deletedTicketWatcher = await prisma.ticketWatcher.delete({
			where: {
				userId_ticketId: {
					userId,
					ticketId: ticketId
				}
			}
		});

		return deletedTicketWatcher;
	}
}
