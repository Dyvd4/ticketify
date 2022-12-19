import config from '@config';
import { authentication } from '@core/middlewares/Auth';
import TicketWatcherSchema from '@core/schemas/TicketWatcherSchema';
import prisma from "@prisma";
import express from 'express';
import jwt from "jsonwebtoken";

const Router = express.Router();

const { CLIENT_URL, JWT_SECRET_KEY } = config;

Router.post('/ticketWatcher', authentication(), async (req, res, next) => {
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

Router.delete('/ticketWatcher/:userId/:ticketId', authentication(), async (req, res, next) => {
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

Router.get("/ticketWatcher/unwatch/:encodedUserId/:ticketId", async (req, res, next) => {
    const { encodedUserId, ticketId } = req.params;
    try {

        const { data: { userId } } = jwt.verify(encodedUserId, JWT_SECRET_KEY) as { data: { userId: string } };

        await prisma.ticketWatcher.delete({
            where: {
                userId_ticketId: {
                    userId,
                    ticketId: parseInt(ticketId)
                }
            }
        });

        res.redirect(`${CLIENT_URL}/Ticket/Details/${ticketId}`);
    }
    catch (e) {
        next(e)
    }
});

export default Router;