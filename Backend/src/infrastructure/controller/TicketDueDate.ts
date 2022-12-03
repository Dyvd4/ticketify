import express from 'express';
import TicketDueDateSchema from "@schemas/TicketDueDate";
import prisma from "@prisma";

const Router = express.Router();

Router.get('/ticketDueDates', async (req, res, next) => {
    try {
        const ticketDueDates = await prisma.ticketDueDate.findMany();
        res.json({ items: ticketDueDates });
    }
    catch (e) {
        next(e)
    }
});

Router.get('/ticketDueDate/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const ticketDueDate = await prisma.ticketDueDate.findFirst({
            where: {
                durationInMinutes: id
            }
        });
        res.json(ticketDueDate);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/ticketDueDate', async (req, res, next) => {
    let ticketDueDate = req.body;
    try {
        const validation = TicketDueDateSchema.validate(ticketDueDate);
        if (validation.error) return res.status(400).json({ validation });
        ticketDueDate = validation.value;

        const newticketDueDate = await prisma.ticketDueDate.create({
            data: ticketDueDate
        });
        res.json(newticketDueDate);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/ticketDueDate/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    let ticketDueDate = req.body;
    try {
        const validation = TicketDueDateSchema.validate(ticketDueDate);
        if (validation.error) return res.status(400).json({ validation });
        ticketDueDate = validation.value;

        const updatedticketDueDate = await prisma.ticketDueDate.update({
            where: {
                durationInMinutes: id
            },
            data: ticketDueDate
        })
        res.json(updatedticketDueDate);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/ticketDueDate/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const deletedticketDueDate = await prisma.ticketDueDate.delete({
            where: {
                durationInMinutes: id
            }
        });
        res.json(deletedticketDueDate);
    }
    catch (e) {
        next(e)
    }
});

export default Router;