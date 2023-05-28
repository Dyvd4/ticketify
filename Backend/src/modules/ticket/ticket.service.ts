import { Injectable } from "@nestjs/common";
import { PrismaFileToClientFileMap } from "@src/modules/file/maps/prisma-file-to-client.map";
import { PrismaService } from "@src/modules/global/database/prisma.service";

@Injectable()
export class TicketService {
	constructor(private prisma: PrismaService) {}

	async findOne(id: number) {
		const { prisma } = this;

		const ticket = await prisma.ticket.findFirst({
			where: {
				id,
			},
			include: {
				priority: true,
				responsibleUser: {
					include: {
						avatar: {
							include: {
								file: true,
							},
						},
					},
				},
				status: true,
				connectedToTickets: {
					include: {
						connectedToTicket: {
							include: {
								priority: true,
								responsibleUser: true,
								status: true,
							},
						},
					},
				},
				connectedByTickets: {
					include: {
						connectedByTicket: {
							include: {
								priority: true,
								responsibleUser: true,
								status: true,
							},
						},
					},
				},
			},
		});

		if (ticket?.responsibleUser?.avatar)
			(ticket.responsibleUser.avatar as any) = PrismaFileToClientFileMap(
				ticket.responsibleUser.avatar.file
			);

		return ticket;
	}
}
