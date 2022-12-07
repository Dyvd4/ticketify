import TicketSchema from "@core/schemas/TicketSchema";
import { getCurrentUser } from '@core/services/CurrentUserService';
import InfiniteLoader from '@lib/list/InfiniteLoader';
import Pager from '@lib/list/Pager';
import { fileUpload, validateFiles } from '@lib/middlewares/FileUpload';
import { isImageFile } from '@lib/utils/FileUtils';
import prisma from "@prisma";
import MulterFileToFileEntityMap from '@core/maps/MulterFileToFileEntityMap';
import express from 'express';
import FileEntityToClientMap from "@core/maps/FileEntityToClientMap";

const Router = express.Router();

Router.get('/tickets', async (req, res, next) => {
    try {
        const pager = new Pager(req.query);
        const tickets = await prisma.ticket.findMany({
            ...pager.getPrismaArgs(),
            include: {
                priority: true
            },
            orderBy: pager.getPrismaOrderByArgs(),
            where: pager.getPrismaFilterArgs()
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
        if (ticket?.responsibleUser?.avatar) (ticket.responsibleUser.avatar as any) = FileEntityToClientMap(ticket.responsibleUser.avatar.file, "base64");
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
            .map(image => FileEntityToClientMap(image, "base64"));
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

        const filesToCreate = files.map(file => MulterFileToFileEntityMap(file));
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
    let ticket = req.body;
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
        const filesToCreate = files.map(file => MulterFileToFileEntityMap(file));
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