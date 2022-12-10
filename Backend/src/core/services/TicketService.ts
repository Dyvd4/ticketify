import FileEntityToClientMap from "@core/maps/FileEntityToClientMap";
import prisma from "@prisma";

export const getTicket = async (ticketId: string) => {

    const ticket = await prisma.ticket.findFirst({
        where: {
            id: parseInt(ticketId)
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

    if (ticket?.responsibleUser?.avatar) (ticket.responsibleUser.avatar as any) = FileEntityToClientMap(ticket.responsibleUser.avatar.file, "base64");

    return ticket;
}

export default {
    getTicket
}