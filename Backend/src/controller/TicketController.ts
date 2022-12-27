import FileEntityToClientMap from "@core/maps/FileEntityToClientMap";
import MulterFileToFileEntityMap from '@core/maps/MulterFileToFileEntityMap';
import TicketSchema, { TicketUpdateSchema } from "@core/schemas/TicketSchema";
import { TicketStatus } from "@core/schemas/TicketStatusSchema";
import { getCurrentUser } from '@core/services/CurrentUserService';
import FileService from "@core/services/FileService";
import { getTicket } from "@core/services/TicketService";
import InfiniteLoader from '@lib/list/InfiniteLoader';
import Pager from '@lib/list/Pager';
import { multipleFileUpload, withErrorHandling } from '@lib/middlewares/FileUpload';
import { isImageFile } from '@lib/utils/FileUtils';
import prisma from "@prisma";
import express from 'express';

const Router = express.Router();

Router.get('/tickets/:excludeIds?', async (req, res, next) => {
    try {
        const excludeIds = JSON.parse((req.query.excludeIds || "[]") as string).map(id => parseInt(id));

        const pager = new Pager(req.query);
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
        res.json(pager.getResult(tickets, ticketsCount));
    }
    catch (e) {
        next(e)
    }
});

Router.get("/tickets/assigned/:userId?", async (req, res, next) => {
    const { userId } = req.params;
    try {
        const infiniteLoader = new InfiniteLoader(req.query);
        const tickets = await prisma.ticket.findMany({
            ...infiniteLoader.getPrismaArgs(),
            include: {
                priority: true
            },
            where: {
                responsibleUserId: userId || getCurrentUser().id
            }
        });
        const ticketsCount = await prisma.ticket.count();
        res.json(infiniteLoader.getResult(tickets, ticketsCount));
    }
    catch (e) {
        next(e)
    }
});

Router.get('/ticket/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const ticket = await getTicket(id);
        res.json(ticket);
    }
    catch (e) {
        next(e)
    }
});

Router.get('/ticket/attachments/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
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
        const attachments = ticket?.attachments.map(attachment => FileEntityToClientMap(attachment.file)) || [];
        const files = attachments?.filter(attachment => !isImageFile({ ...attachment, originalname: attachment.originalFileName })) || []
        const images = attachments?.filter(attachment => isImageFile({ ...attachment, originalname: attachment.originalFileName })) || [];
        // 🥵
        (ticket as any).attachments = attachments;
        (ticket as any).files = files;
        (ticket as any).images = images;
        res.json(ticket);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/ticket', multipleFileUpload, async (req, res, next) => {
    let ticket = req.body;
    const files = req.files as Express.Multer.File[];
    try {
        const validation = TicketSchema.validate(ticket);
        if (validation.error) return res.status(400).json({ validation });
        ticket = validation.value;

        const validationOrCreatedFiles = await FileService.validateAndCreateFiles(files.map(file => MulterFileToFileEntityMap(file)));

        if ("validations" in validationOrCreatedFiles) {
            return res.status(400).json(validationOrCreatedFiles);
        }

        const openTicketStatus = await prisma.ticketStatus.findFirst({
            where: {
                name: TicketStatus.open
            }
        });

        const newTicket = await prisma.ticket.create({
            data: {
                ...ticket,
                attachments: {
                    create: validationOrCreatedFiles.map(file => ({
                        fileId: file.id
                    }))
                },
                statusId: openTicketStatus?.id
            }
        });

        res.json(newTicket);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/ticket/:id', async (req, res, next) => {
    const { id } = req.params;
    let ticket = req.body;
    try {
        const validation = TicketUpdateSchema.validate(ticket);
        if (validation.error) return res.status(400).json({ validation });
        ticket = validation.value;

        const updatedTicket = await prisma.ticket.update({
            where: {
                id: parseInt(id)
            },
            data: ticket
        })
        res.json(updatedTicket);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/ticket/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedTicket = await prisma.ticket.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(deletedTicket);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/ticket/file', async (req, res, next) => {
    multipleFileUpload(...withErrorHandling(req, res, async () => {
        const { id: ticketId } = req.body;
        const files = req.files as Express.Multer.File[]
        try {

            const validationOrCreatedFiles = await FileService.validateAndCreateFiles(files.map(file => MulterFileToFileEntityMap(file)));

            if ("validations" in validationOrCreatedFiles) {
                return res.status(400).json(validationOrCreatedFiles);
            }

            const updatedTicket = await prisma.ticket.update({
                where: {
                    id: parseInt(ticketId)
                },
                data: {
                    attachments: {
                        create: validationOrCreatedFiles.map(file => {
                            return {
                                fileId: file.id
                            }
                        })
                    }
                }
            });

            res.json(updatedTicket)
        }
        catch (e) {
            next(e)
        }
    }))
});

export default Router;