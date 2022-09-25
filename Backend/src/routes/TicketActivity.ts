import express from 'express';
import { prisma } from "../server";

const Router = express.Router();

Router.get('/ticketActivities', async (req, res, next) => {
    try {
        const ticketActivities = await prisma.ticketActivity.findMany({
            include: {
                ticket: true,
                createdFrom: true
            }
        });
        res.json({ items: ticketActivities });
    }
    catch (e) {
        next(e)
    }
});

Router.get('/ticketActivity/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const ticketActivity = await prisma.ticketActivity.findFirst({
            where: {
                id
            },
            include: {
                ticket: true,
                createdFrom: true
            }
        });
        res.json(ticketActivity);
    }
    catch (e) {
        next(e)
    }
});

export default Router;