import prisma from "@prisma";
import CreateTicketActivityBasedOn from "./TicketActivity";

export const createActivityIfDescriptionHasChanged = CreateTicketActivityBasedOn("Ticket", ["update"], {
    onlyIf: async (event, args) => {

        const ticketId = args.where.id;
        const newDescription = args.data.description
        const ticket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        }))!

        const descriptionHasChanged = newDescription
            ? ticket.description !== newDescription
            : false
        return descriptionHasChanged;
    },
    descriptionEvaluator: async () => `Description changed`,
    ticketIdEvaluator: (event, args) => args.where.id
})

export const createActivityIfStatusHasChanged = CreateTicketActivityBasedOn("Ticket", ["update"], {
    onlyIf: async (event, args) => {

        const ticketId = args.where.id;
        const newStatusId = args.data.statusId
        // TODO: provide ctx to pass it down?
        const oldTicket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        }))!

        const statusHasChanged = newStatusId
            ? oldTicket.statusId !== newStatusId
            : false
        return statusHasChanged;
    },
    descriptionEvaluator: async (event, args) => {

        const ticketId = args.where.id;
        const newStatusId = args.data.statusId;

        // TODO: get from ctx?
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

            return `Status changed from "${oldTicket.status!.name}" to "${status.name}"`
        }

        return null
    },
    ticketIdEvaluator: (event, args) => args.where.id
})

export const createActivityIfResponsibleUserHasChanged = CreateTicketActivityBasedOn("Ticket", ["update"], {
    onlyIf: async (event, args) => {

        const ticketId = args.where.id;
        const newResponsibleUserId = args.data.responsibleUserId
        const oldTicket = (await prisma.ticket.findUnique({
            where: {
                id: ticketId
            }
        }))!

        const responsibleUserHasChanged = newResponsibleUserId
            ? oldTicket.responsibleUserId !== newResponsibleUserId
            : false
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

            return `Responsible user changed from "${oldTicket.responsibleUser?.username || "none"}" to "${responsibleUser.username}"`
        }

        return null
    },
    ticketIdEvaluator: (event, args) => args.where.id
})

export const createActivityByComment = CreateTicketActivityBasedOn("Comment", ["create", "update"], {
    onlyIf: async (event, args) => {
        if (event === "update") {

            const newCommentContent = args.data.content;

            const commentId = args.where.id;
            const oldComment = (await prisma.comment.findUnique({
                where: {
                    id: commentId
                }
            }))!;

            const commentContentHasChanged = oldComment.content !== newCommentContent;
            return commentContentHasChanged;
        }
        return true;
    },
    descriptionEvaluator: async (event, args) => {
        if (event === "update") {

            const newCommentContent = args.data.content;

            const commentId = args.where.id;
            const oldComment = (await prisma.comment.findUnique({
                where: {
                    id: commentId
                }
            }))!;

            return `Comment content changed from "${oldComment.content}" to "${newCommentContent}"`;
        }
        return null;
    }
});