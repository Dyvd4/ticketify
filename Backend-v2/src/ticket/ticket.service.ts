import { Injectable } from '@nestjs/common';
import FileEntityToClientDto from '@src/file/file.dtos';
import { PrismaService } from '@src/global/database/database.prisma.service';

@Injectable()
export class TicketService {

	constructor(private prisma: PrismaService) { }

	async findOne(id: number) {
		
		const { prisma } = this;
		
		const ticket = await prisma.ticket.findFirst({
			where: {
				id
			},
			include: {
				priority: true,
				responsibleUser: {
					include: {
						avatar: {
							include: {
								file: true
							}
						}
					}
				},
				status: true,
				connectedToTickets: {
					include: {
						connectedToTicket: {
							include: {
								priority: true,
								responsibleUser: true,
								status: true
							}
						}
					}
				},
				connectedByTickets: {
					include: {
						connectedByTicket: {
							include: {
								priority: true,
								responsibleUser: true,
								status: true
							}
						}
					}
				}
			}
		});

		if (ticket?.responsibleUser?.avatar) (ticket.responsibleUser.avatar as any) = FileEntityToClientDto(ticket.responsibleUser.avatar.file);

		return ticket;
	}
}
