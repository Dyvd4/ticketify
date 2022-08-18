import express from 'express';
import TicketSchema from "../schemas/Ticket";
import { prisma } from "../server";
import { mapFilterQuery } from '../utils/filter';
import { mapOrderByQuery } from '../utils/orderBy';

const Router = express.Router();

Router.get('/tickets', async (req, res, next) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                priority: true
            },
            orderBy: mapOrderByQuery(req.query),
            where: mapFilterQuery(req.query)
        });
        res.json(tickets);
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
            }
        });
        res.json(ticket);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/ticket', async (req, res, next) => {
    let ticket = req.body;
    try {
        const validation = TicketSchema.validate(ticket);
        if (validation.error) return res.status(400).json({ validation });
        ticket = validation.value;

        const newticket = await prisma.ticket.create({
            data: ticket
        });
        res.json(newticket);
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