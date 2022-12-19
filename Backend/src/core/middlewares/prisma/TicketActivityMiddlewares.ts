import prisma from "@prisma";
import CreateTicketActivityBasedOn from "./TicketActivity";
0
export const createActivityIfDescriptionHasChanged = CreateTicketActivityBasedOn("Ticket", ["update"], {
    onlyIf: async (event, args) => {

        const ticketId = args.where.id;
        const newDescription = args.data.description
        const ticket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        }))!

        const descriptionHasChanged = ticket.description !== newDescription
        return descriptionHasChanged;
    },
    descriptionEvaluator: async () => `Description changed`,
    ticketIdEvaluator: (event, args) => args.where.id
})

export const createActivityIfStatusHasChanged = CreateTicketActivityBasedOn("Ticket", ["update"], {
    onlyIf: async (event, args) => {

        const ticketId = args.where.id;
        const newStatusId = args.data.statusId
        const ticket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        }))!

        const statusHasChanged = ticket.statusId !== newStatusId
        return statusHasChanged;
    },
    descriptionEvaluator: async (event, args) => {

        const ticketId = args.where.id;
        const newStatusId = args.data.statusId;

        const oldTicket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            },
            include: {
                responsibleUser: true,
                status: true
            }
        }))!

        if (newStatusId) {
            const status = (await prisma.ticketStatus.findUnique({
                where: {
                    id: newStatusId
                }
            }))!;

            return `Status changed from ${oldTicket.status!.name} to ${status.name}`
        }

        return null
    },
    ticketIdEvaluator: (event, args) => args.where.id
})

export const createActivityIfResponsibleUserHasChanged = CreateTicketActivityBasedOn("Ticket", ["update"], {
    onlyIf: async (event, args) => {

        const ticketId = args.where.id;
        const newResponsibleUserId = args.data.responsibleUserId
        const ticket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        }))!

        const responsibleUserHasChanged = ticket.responsibleUserId !== newResponsibleUserId
        return responsibleUserHasChanged
    },
    descriptionEvaluator: async (event, args) => {

        const ticketId = args.where.id;
        const newResponsibleUserId = args.data.responsibleUserId

        const oldTicket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            },
            include: {
                responsibleUser: true,
                status: true
            }
        }))!

        if (newResponsibleUserId) {
            const responsibleUser = (await prisma.user.findUnique({
                where: {
                    id: newResponsibleUserId
                }
            }))!;

            return `Responsible user changed from ${oldTicket.responsibleUser?.username || "none"} to ${responsibleUser.username}`
        }

        return null
    },
    ticketIdEvaluator: (event, args) => args.where.id
})

export const createActivityByComment = CreateTicketActivityBasedOn("Comment", ["create", "update"]);