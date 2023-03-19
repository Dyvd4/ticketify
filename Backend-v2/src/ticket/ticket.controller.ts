import { PrismaService } from '@database/database.prisma.service';
import { Body, Controller, Delete, Get, NotImplementedException, Param, ParseArrayPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { User as TUser } from "@prisma/client";
import FileEntityToClientDto from '@src/file/file.dtos';
import { User } from '@src/global/auth/auth.user.decorator';
import { InfiniteLoaderQueryDto, PagerQueryDto } from '@src/lib/list/list.dtos';
import ListResult from '@src/lib/list/result/list-result';
import { InfiniteLoader, Pager } from 'src/lib/list';
import { UpdateTicketDto, UpdateTicketStatusDto } from './ticket.dtos';
import { TicketService } from './ticket.service';

@Controller()
export class TicketController {

	constructor(
		private readonly prisma: PrismaService,
		private readonly ticketService: TicketService
	) { }

	@ApiParam({
		name: "excludeIds",
		required: false
	})
	@Get("tickets/:excludeIds?")
	async getTickets(
		@Query() query: PagerQueryDto,
		@Param("excludeIds", new ParseArrayPipe({ separator: ",", items: Number, optional: true })) excludeIds: number[] = []
	) {
		const { prisma } = this;

		const pager = new Pager(query);
		const tickets = await prisma.ticket.findMany({
			...pager.getPrismaArgs(),
			include: {
				priority: true,
				status: true
			},
			orderBy: pager.getPrismaOrderByArgs(),
			where: {
				...pager.getPrismaFilterArgs(),
				id: {
					notIn: excludeIds
				}
			}
		});
		const ticketsCount = await prisma.ticket.count();

		return pager.getResult(tickets, ticketsCount);
	}

	// TODO: rename to pascal-case or at least do not use sub routes
	// as sub routes should contain resources
	@Get('ticket/assigned/groupedByStatus')
	async getTicketsAssignedByUserAndGroupedByStatus(
		@User() requestUser: TUser
	) {

		const { prisma } = this;

		const tickets = await prisma.ticket.findMany({
			include: {
				priority: true
			},
			where: {
				responsibleUserId: requestUser.id
			}
		});

		const ticketStatuses = (await prisma.ticketStatus.findMany())

		return new ListResult(ticketStatuses.map(status => {
			return {
				name: status.name,
				items: tickets.filter(ticket => ticket.statusId === status.id)
			}
		}));
	}

	@ApiParam({
		name: "userId",
		required: false
	})
	@Get('tickets/assigned/:userId?')
	async getTicketsAssignedByUser(
		@User() requestUser: TUser,
		@Query() query: InfiniteLoaderQueryDto,
		@Param("userId") userId?: string
	) {

		const { prisma } = this;

		const infiniteLoader = new InfiniteLoader(query);
		const tickets = await prisma.ticket.findMany({
			...infiniteLoader.getPrismaArgs(),
			include: {
				priority: true
			},
			where: {
				responsibleUserId: userId || requestUser.id
			}
		});
		const ticketsCount = await prisma.ticket.count();

		return infiniteLoader.getResult(tickets, ticketsCount);
	}

	@Get('ticket/:id')
	async getTicket(@Param("id") id: number) {
		const ticket = await this.ticketService.findOne(id);
		return ticket;
	}

	@Get('ticket/attachments/:id')
	async getTicketAttachments(
		@Param("id") id: string
	) {

		const { prisma } = this;

		const ticket = await prisma.ticket.findFirst({
			where: {
				id: parseInt(id)
			},
			select: {
				attachments: {
					include: {
						file: true
					}
				}
			}
		});
		const attachments = ticket?.attachments.map(attachment => FileEntityToClientDto(attachment.file)) || [];
		// TODO: rethink about image business logic
		// const files = attachments?.filter(attachment => !isImageFile({ ...attachment, originalname: attachment.originalFileName })) || []
		// const images = attachments?.filter(attachment => isImageFile({ ...attachment, originalname: attachment.originalFileName })) || [];
		// 🥵
		(ticket as any).attachments = attachments;
		(ticket as any).files = [] as any[] // files;
		(ticket as any).images = [] as any[] // images;

		return ticket;
	}

	@Post('ticket')
	createTicket() {
		throw new NotImplementedException();
	}

	@Post('ticket/file')
	async createTicketFile() {
		throw new NotImplementedException();
	}

	@Patch('ticket/status/:id')
	async updateTicketStatus(
		@Param('id') id: number,
		@Body() updateTicketStatusDto: UpdateTicketStatusDto
	) {

		const { prisma } = this;

		const updatedTicket = await prisma.ticket.update({
			where: {
				id
			},
			data: updateTicketStatusDto
		})

		return updatedTicket;
	}

	@Patch('ticket/:id')
	async updateTicket(
		@Param('id') id: number,
		@Body() updateTicketDto: UpdateTicketDto
	) {

		const { prisma } = this;

		const updatedTicket = await prisma.ticket.update({
			where: {
				id
			},
			data: updateTicketDto
		})

		return updatedTicket;
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {

		const { prisma } = this;

		const deletedTicket = await prisma.ticket.delete({
			where: {
				id
			}
		});

		return deletedTicket;
	}
}
