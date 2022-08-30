import express from 'express';
import mapFile from '../schemas/maps/File';
import TicketSchema from "../schemas/Ticket";
import { prisma } from "../server";
import { fileUpload, validateFiles, isImageFile } from '../utils/file';
import { mapFilterQuery } from '../utils/filter';
import { mapOrderByQuery } from '../utils/orderBy';
import { PagerResult } from '../utils/pager';

const Router = express.Router();

const ITEMS_PER_PAGE = 10;

Router.get('/tickets', async (req, res, next) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                priority: true
            },
            orderBy: mapOrderByQuery(req.query),
            where: mapFilterQuery(req.query)
        });
        res.json(new PagerResult(tickets,
            ITEMS_PER_PAGE,
            parseInt((req.query.page as string | undefined) || "1")));
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
                id
            },
            include: {
                priority: true,
                responsibleUser: true,
                status: true,
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
            .map(image => {
                return {
                    ...image,
                    content: image.content.toString("base64")
                }
            });
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

        const filesToCreate = files.map(file => mapFile(file));
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

        const updatedticket = await prisma.ticket.update({
            where: {
                id
            },
            data: ticket
        })
        res.json(updatedticket);
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
                id
            }
        });
        res.json(deletedticket);
    }
    catch (e) {
        next(e)
    }
});

export default Router;