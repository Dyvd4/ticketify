import express from 'express';
import TicketStatusSchema from "@core/schemas/TicketStatusSchema"
import prisma from "@prisma";
import { authentication } from '@core/middlewares/Auth';

const Router = express.Router();
Router.use("/ticketStatus", authentication());
Router.use('/ticketStatuses', authentication())

Router.get('/ticketStatuses', async (req, res, next) => {
    try {
        const ticketStatuses = await prisma.ticketStatus.findMany();
        res.json({ items: ticketStatuses });
    }
    catch (e) {
        next(e)
    }
});

Router.get('/ticketStatus/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const ticketStatus = await prisma.ticketStatus.findFirst({
            where: {
                id
            }
        });
        res.json(ticketStatus);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/ticketStatus', async (req, res, next) => {
    let ticketStatus = req.body;
    try {
        const validation = TicketStatusSchema.validate(ticketStatus);
        if (validation.error) return res.status(400).json({ validation });
        ticketStatus = validation.value;

        const newTicketStatus = await prisma.ticketStatus.create({
            data: ticketStatus
        });
        res.json(newTicketStatus);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/ticketStatus/:id', async (req, res, next) => {
    const { id } = req.params;
    let ticketStatus = req.body;
    try {
        const validation = TicketStatusSchema.validate(ticketStatus);
        if (validation.error) return res.status(400).json({ validation });
        ticketStatus = validation.value;

        const updatedTicketStatus = await prisma.ticketStatus.update({
            where: {
                id
            },
            data: ticketStatus
        })
        res.json(updatedTicketStatus);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/ticketStatus/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedTicketStatus = await prisma.ticketStatus.delete({
            where: {
                id
            }
        });
        res.json(deletedTicketStatus);
    }
    catch (e) {
        next(e)
    }
});

export default Router;