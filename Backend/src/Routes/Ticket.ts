import express from 'express';
import fileParams from '../schemas/params/File';
import ticketParams from '../schemas/params/Ticket';
import TicketSchema from "../schemas/Ticket";
import { prisma } from "../server";
import { getCurrentUser } from '../services/currentUser';
import { fileUpload, isImageFile, mapFile, validateFiles } from '../utils/file';
import { prismaFilterArgs } from '../utils/filter';
import InfiniteLoadingResult, { prismaArgs as infiniteLoadingResultPrismaArgs } from '../utils/List/InfiniteLoadingResult';
import PagerResult, { prismaArgs as pagerResultPrismaArgs } from '../utils/List/PagerResult';
import { prismaOrderByArgs } from '../utils/orderBy';

const Router = express.Router();

Router.get('/tickets', async (req, res, next) => {
    try {
        const params = pagerResultPrismaArgs(req.query);
        const tickets = await prisma.ticket.findMany({
            ...params,
            include: {
                priority: true
            },
            orderBy: prismaOrderByArgs(req.query),
            where: prismaFilterArgs(req.query)
        });
        const ticketsCount = await prisma.ticket.count();
        res.json(new PagerResult(tickets, ticketsCount, params));
    }
    catch (e) {
        next(e)
    }
});

Router.get("/tickets/assigned/:userId?", async (req, res, next) => {
    const { userId } = req.params;
    try {
        const params = infiniteLoadingResultPrismaArgs(req.query);
        const tickets = await prisma.ticket.findMany({
            ...params,
            include: {
                priority: true
            },
            where: {
                responsibleUserId: userId || getCurrentUser().id
            }
        });
        const ticketsCount = await prisma.ticket.count();
        res.json(new InfiniteLoadingResult(tickets, ticketsCount, params));
    }
    catch (e) {
        next(e)
    }
});

Router.get('/ticket/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const ticket = await prisma.ticket.findFirst({
            where: {
                id: parseInt(id)
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
                status: true
            }
        });
        if (ticket?.responsibleUser?.avatar) (ticket.responsibleUser.avatar as any) = mapFile(ticket.responsibleUser.avatar.file, "base64");
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
        const attachments = ticket?.attachments.map(attachment => attachment.file) || [];
        const files = attachments?.filter(attachment => !isImageFile({ ...attachment, originalname: attachment.originalFileName })) || [];
        const images = (attachments?.filter(attachment => isImageFile({ ...attachment, originalname: attachment.originalFileName })) || [])
            .map(image => mapFile(image, "base64"));
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

Router.post('/ticket', fileUpload, validateFiles, async (req, res, next) => {
    let ticket = req.body;
    const files: any = req.files || [];
    try {
        const validation = TicketSchema.validate(ticket);
        if (validation.error) return res.status(400).json({ validation });
        ticket = validation.value;

        const filesToCreate = files.map(file => fileParams(file));
        const newTicket = await prisma.ticket.create({
            data: {
                ...ticket,
                attachments: {
                    create: filesToCreate.map(file => {
                        return {
                            file: {
                                create: file
                            }
                        }
                    })
                }
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
    let ticket = ticketParams(req.body);
    try {
        const validation = TicketSchema.validate(ticket);
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
        const deletedticket = await prisma.ticket.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(deletedticket);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/ticket/fileOnTicket/:ticketId/:fileId', async (req, res, next) => {
    const { ticketId, fileId } = req.params;
    try {
        const deletedFileOnTicket = await prisma.fileOnTicket.delete({
            where: {
                fileId_ticketId: {
                    fileId,
                    ticketId: parseInt(ticketId)
                }
            }
        });
        await prisma.file.delete({
            where: {
                id: fileId
            }
        })
        res.json(deletedFileOnTicket);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/ticket/file', fileUpload, async (req, res, next) => {
    const { id: ticketId } = req.body;
    const files: any = req.files || []
    try {
        const filesToCreate = files.map(file => fileParams(file));
        const updatedTicket = await prisma.ticket.update({
            where: {
                id: parseInt(ticketId)
            },
            data: {
                attachments: {
                    create: filesToCreate.map(file => {
                        return {
                            file: {
                                create: file
                            }
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
});

export default Router;