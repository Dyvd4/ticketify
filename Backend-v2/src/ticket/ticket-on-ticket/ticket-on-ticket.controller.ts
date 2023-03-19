import { BadRequestException, Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PrismaService } from '@src/global/database/database.prisma.service';
import { CreateTicketOnTicketDto } from './ticket-on-ticket.dtos';

@Controller('ticketOnTicket')
export class TicketOnTicketController {

	constructor(
		private readonly prisma: PrismaService
	) { }

	@Post()
	async createTicketOnTicket(
		@Body() createTicketOnTicketDto: CreateTicketOnTicketDto
	) {
		const { prisma } = this;
		const { connectedByTicketId, connectedToTicketId } = createTicketOnTicketDto;

		if (connectedByTicketId === connectedToTicketId) {
			return new BadRequestException({
				validation: {
					message: "Can't connect to own ticket"
				}
			});
		}

		const connectionExisting = await prisma.ticketOnTicket.findUnique({
			where: {
				connectedByTicketId_connectedToTicketId: {
					connectedByTicketId,
					connectedToTicketId
				}
			}
		});

		if (connectionExisting) {
			return new BadRequestException({
				validation: {
					message: "Connection to that ticket already existing"
				}
			});
		}

		const newTicketOnTicket = await prisma.ticketOnTicket.create({
			data: createTicketOnTicketDto
		});

		return newTicketOnTicket;
	}

	@Delete('ticketOnTicket/:connectedByTicketId/:connectedToTicketId')
	async remove(
		@Param('connectedByTicketId') connectedByTicketId: number,
		@Param('connectedToTicketId') connectedToTicketId: number
	) {
		const { prisma } = this;
		const deletedTicketOnTicket = await prisma.ticketOnTicket.delete({
			where: {
				connectedByTicketId_connectedToTicketId: {
					connectedByTicketId: connectedByTicketId,
					connectedToTicketId: connectedToTicketId
				}
			}
		});

		return deletedTicketOnTicket;
	}
}