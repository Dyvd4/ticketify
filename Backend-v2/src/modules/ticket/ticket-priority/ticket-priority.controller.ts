import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from '@src/modules/global/database/prisma.service';
import ListResult from '@src/lib/list/result/list-result';
import { CreateTicketPriorityDto, UpdateTicketPriorityDto } from './ticket-priority.dtos';

@Controller()
export class TicketPriorityController {

	constructor(
		private readonly prisma: PrismaService
	) { }

	@Get('ticketPriorities')
	async findAll() {
		const { prisma } = this;
		const ticketPriorities = await prisma.ticketPriority.findMany();
		return new ListResult(ticketPriorities);
	}

	@Get('ticketPriority/:id')
	async findOne(@Param('id') id: string) {
		const { prisma } = this;

		const ticketPriority = await prisma.ticketPriority.findFirst({
			where: {
				id
			}
		});

		return ticketPriority;
	}

	@Post("ticketPriority")
	async create(@Body() createTicketPriorityDto: CreateTicketPriorityDto) {
		const { prisma } = this;
		const newTicketPriority = await prisma.ticketPriority.create({
			data: createTicketPriorityDto
		});
		return newTicketPriority;
	}

	@Patch('ticketPriority/:id')
	async update(@Param('id') id: string, @Body() updateTicketPriorityDto: UpdateTicketPriorityDto) {
		const { prisma } = this;

		const updatedTicketPriority = await prisma.ticketPriority.update({
			where: {
				id
			},
			data: updateTicketPriorityDto
		});

		return updatedTicketPriority;
	}

	@Delete('ticketPriority/:id')
	async remove(@Param('id') id: string) {
		const { prisma } = this;

		const deletedTicketPriority = await prisma.ticketPriority.delete({
			where: {
				id
			}
		});

		return deletedTicketPriority;
	}
}
