import { authentication } from '@core/middlewares/Auth';
import InfiniteLoader from '@lib/list/InfiniteLoader';
import prisma from "@prisma";
import express from 'express';

const Router = express.Router();
Router.use("/ticketActivities", authentication())
Router.use("/ticketActivity", authentication());

Router.get('/ticketActivities', async (req, res, next) => {
    const { ticketId } = req.query;
    try {
        const infiniteLoader = new InfiniteLoader(req.query);
        const ticketActivities = await prisma.ticketActivity.findMany({
            ...infiniteLoader.getPrismaArgs(),
            include: {
                ticket: true,
                createdFrom: true,
            },
            orderBy: {
                createdAt: "desc"
            },
            where: {
                ticketId: ticketId
                    ? parseInt(ticketId as string)
                    : undefined
            }
        });
        const ticketActivitiesCount = await prisma.ticketActivity.count({
            where: {
                ticketId: ticketId
                    ? parseInt(ticketId as string)
                    : undefined
            }
        });
        res.json(infiniteLoader.getResult(ticketActivities, ticketActivitiesCount));
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