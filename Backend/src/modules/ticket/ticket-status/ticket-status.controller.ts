import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from '@src/modules/global/database/prisma.service';
import ListResult from '@src/lib/list/result/list-result';
import { CreateTicketStatusDto, UpdateTicketStatusDto } from './ticket-status.dtos';

@Controller()
export class TicketStatusController {

	constructor(
		private readonly prisma: PrismaService
	) { }

	@Get("ticketStatuses")
	async findAll() {
		const { prisma } = this;
		const ticketStatuses = await prisma.ticketStatus.findMany();
		return new ListResult(ticketStatuses);
	}

	@Get('ticketStatus/:id')
	async findOne(@Param('id') id: string) {
		const { prisma } = this;

		const ticketStatus = await prisma.ticketStatus.findFirst({
			where: {
				id
			}
		});

		return ticketStatus;
	}

	@Post("ticketStatus")
	async create(@Body() createTicketStatusDto: CreateTicketStatusDto) {
		const { prisma } = this;

		const newTicketStatus = await prisma.ticketStatus.create({
			data: createTicketStatusDto
		});

		return newTicketStatus;
	}



	@Patch('ticketStatus/:id')
	async update(
		@Param('id') id: string,
		@Body() updateTicketStatusDto: UpdateTicketStatusDto
	) {

		const { prisma } = this;

		const updatedTicketStatus = await prisma.ticketStatus.update({
			where: {
				id
			},
			data: updateTicketStatusDto
		})

		return updatedTicketStatus;
	}

	@Delete('ticketStatus/:id')
	async remove(@Param('id') id: string) {

		const { prisma } = this;

		const deletedTicketStatus = await prisma.ticketStatus.delete({
			where: {
				id
			}
		});

		return deletedTicketStatus;
	}
}
