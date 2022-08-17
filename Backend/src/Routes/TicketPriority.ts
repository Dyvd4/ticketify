import express from 'express';
import TicketPrioritySchema from "../schemas/TicketPriority";
import { prisma } from "../server";

const Router = express.Router();

Router.get('/ticketPriorities', async (req, res, next) => {
    try {
        const ticketPriorities = await prisma.ticketPriority.findMany();
        res.json(ticketPriorities);
    }
    catch (e) {
        next(e)
    }
});

Router.get('/ticketPriority/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const ticketPriority = await prisma.ticketPriority.findFirst({
            where: {
                id
            }
        });
        res.json(ticketPriority);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/ticketPriority', async (req, res, next) => {
    let ticketPriority = req.body;
    try {
        const validation = TicketPrioritySchema.validate(ticketPriority);
        if (validation.error) return res.status(400).json({ validation });
        ticketPriority = validation.value;

        const newticketPriority = await prisma.ticketPriority.create({
            data: ticketPriority
        });
        res.json(newticketPriority);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/ticketPriority/:id', async (req, res, next) => {
    const { id } = req.params;
    let ticketPriority = req.body;
    try {
        const validation = TicketPrioritySchema.validate(ticketPriority);
        if (validation.error) return res.status(400).json({ validation });
        ticketPriority = validation.value;

        const updatedticketPriority = await prisma.ticketPriority.update({
            where: {
                id
            },
            data: ticketPriority
        })
        res.json(updatedticketPriority);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/ticketPriority/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedticketPriority = await prisma.ticketPriority.delete({
            where: {
                id
            }
        });
        res.json(deletedticketPriority);
    }
    catch (e) {
        next(e)
    }
});

export default Router;