import { PrismaService } from '@src/modules/global/database/database.prisma.service';
import { Body, Controller, Delete, Get, NotImplementedException, Param, ParseArrayPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiParam } from '@nestjs/swagger';
import { User as TUser } from "@prisma/client";
import { parseFilePipe } from '@src/modules/file/file.pipes';
import { FileService } from '@src/modules/file/file.service';
import { isImageFile } from '@src/modules/file/file.utils';
import { User } from '@src/modules/global/auth/auth.user.decorator';
import { InfiniteLoaderQueryDto, PagerQueryDto } from '@src/lib/list/list.dtos';
import ListResult from '@src/lib/list/result/list-result';
import { InfiniteLoader, Pager } from 'src/lib/list';
import { UpdateTicketDto, UpdateTicketStatusDto } from './ticket.dtos';
import { TicketService } from './ticket.service';

@Controller()
export class TicketController {

	constructor(
		private readonly prisma: PrismaService,
		private readonly ticketService: TicketService,
		private readonly fileService: FileService
	) { }

	@ApiParam({
		name: "excludeIds",
		required: false
	})
	@Get("tickets/pager/:excludeIds?")
	async getTicketsWithPager(
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

	@ApiParam({
		name: "excludeIds",
		required: false
	})
	@Get("tickets/:excludeIds?")
	async getTickets(
		@Param("excludeIds", new ParseArrayPipe({ separator: ",", items: Number, optional: true })) excludeIds: number[] = []
	) {
		const { prisma } = this;

		const tickets = await prisma.ticket.findMany({
			include: {
				priority: true,
				status: true
			},
			where: {
				id: {
					notIn: excludeIds
				}
			}
		});

		return new ListResult(tickets);
	}

	// TODO: rename to pascal-case or at least do not use sub routes
	// as sub routes should contain resources
	@Get('tickets/assigned/groupedByStatus')
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
		const attachments = ticket?.attachments
			? await Promise.all(ticket.attachments.map(attachment => this.fileService.getFileWithSignedUrl(attachment.file)))
			: [];
		const files = attachments?.filter(attachment => !isImageFile({ ...attachment, originalname: attachment.originalFileName })) || []
		const images = attachments?.filter(attachment => isImageFile({ ...attachment, originalname: attachment.originalFileName })) || [];
		// 🥵
		(ticket as any).attachments = attachments;
		(ticket as any).files = files;
		(ticket as any).images = images;

		return ticket;
	}

	@Post('ticket')
	createTicket() {
		throw new NotImplementedException();
	}

	@Post('ticket/:id/file')
	@UseInterceptors(FilesInterceptor("files"))
	async createTicketFile(
		@Param("id") ticketId: string,
		@UploadedFiles(parseFilePipe) files: Express.Multer.File[]
	) {
		const createdOrUpdatedFiles = await this.fileService.createOrUpdateFiles(files);

		const updatedTicket = await this.prisma.ticket.update({
			where: {
				id: parseInt(ticketId)
			},
			data: {
				attachments: {
					create: createdOrUpdatedFiles.map(file => {
						return {
							fileId: file.id
						}
					})
				}
			}
		});

		return updatedTicket;
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
