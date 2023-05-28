import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { User as TUser } from "@prisma/client";
import ListResult from "@src/lib/list/result/list-result";
import { User } from "@src/modules/global/auth/user.decorator";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { ValidationException } from "@src/modules/global/validation.exception";
import { CreatePinnedTicketDto } from "./pinned-ticket.dtos";

@Controller()
export class PinnedTicketController {
	constructor(private readonly prisma: PrismaService) {}

	@Get("pinned-tickets")
	async getPinnedTickets(@User() requestUser: TUser) {
		const { prisma } = this;

		const pinnedTickets = await prisma.pinnedTicket.findMany({
			where: {
				userId: requestUser.id,
			},
			include: {
				user: true,
				ticket: true,
			},
		});

		return new ListResult(pinnedTickets.map((pinnedTicket) => pinnedTicket.ticket));
	}

	@Get("tickets-to-pin")
	async getTicketsToPin(@User() requestUser: TUser) {
		const { prisma } = this;

		const alreadyPinnedTickets = await prisma.pinnedTicket.findMany({
			where: {
				userId: requestUser.id,
			},
		});

		const pinnedTickets = await prisma.ticket.findMany({
			where: {
				id: {
					notIn: alreadyPinnedTickets.map((pinnedTicket) => pinnedTicket.ticketId),
				},
			},
		});

		const ticketsToPin = pinnedTickets;
		return new ListResult(ticketsToPin);
	}

	@Post("pinned-ticket")
	async create(@User() requestUser: TUser, @Body() { ticketId }: CreatePinnedTicketDto) {
		const { prisma } = this;

		const existingPinnedTicket = await prisma.pinnedTicket.findUnique({
			where: {
				ticketId_userId: {
					userId: requestUser.id,
					ticketId,
				},
			},
		});

		if (existingPinnedTicket) {
			throw new ValidationException("Pinned ticket already existing");
		}

		const newPinnedTicket = await prisma.pinnedTicket.create({
			data: {
				userId: requestUser.id,
				ticketId,
			},
		});

		return newPinnedTicket;
	}

	@Delete("pinned-ticket/:ticketId")
	async remove(@User() requestUser: TUser, @Param("ticketId") ticketId: number) {
		const { prisma } = this;

		const deletedPinnedTicket = await prisma.pinnedTicket.delete({
			where: {
				ticketId_userId: {
					userId: requestUser.id,
					ticketId,
				},
			},
		});

		return deletedPinnedTicket;
	}
}
