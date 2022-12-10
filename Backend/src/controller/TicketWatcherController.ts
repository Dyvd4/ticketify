import TicketWatcherSchema from '@core/schemas/TicketWatcherSchema';
import prisma from "@prisma";
import express from 'express';

const Router = express.Router();

Router.post('/ticketWatcher', async (req, res, next) => {
    let ticketWatcher = req.body;
    try {
        const validation = TicketWatcherSchema.validate(ticketWatcher);
        if (validation.error) return res.status(400).json({ validation });
        ticketWatcher = validation.value;

        const ticketWatcherExisting = await prisma.ticketWatcher.findUnique({
            where: {
                userId_ticketId: ticketWatcher
            }
        });

        if (ticketWatcherExisting) {
            return res.status(400).json({
                validation: {
                    message: "ticketWatcher already existing"
                }
            });
        }

        const newTicketWatcher = await prisma.ticketWatcher.create({
            data: ticketWatcher
        });

        res.json(newTicketWatcher);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/ticketWatcher/:userId/:ticketId', async (req, res, next) => {
    const { userId, ticketId } = req.params;
    try {
        const deletedTicketWatcher = await prisma.ticketWatcher.delete({
            where: {
                userId_ticketId: {
                    userId,
                    ticketId: parseInt(ticketId)
                }
            }
        });
        res.json(deletedTicketWatcher);
    }
    catch (e) {
        next(e)
    }
});

export default Router;