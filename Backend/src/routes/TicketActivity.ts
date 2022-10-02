import express from 'express';
import { prisma } from "../server";
import InfiniteLoadingResult, { prismaParams } from '../utils/List/InfiniteLoadingResult';

const Router = express.Router();

Router.get('/ticketActivities', async (req, res, next) => {
    try {
        const infiniteLoadingParams = prismaParams(req.query);
        const ticketActivities = await prisma.ticketActivity.findMany({
            ...infiniteLoadingParams,
            include: {
                ticket: true,
                createdFrom: true,
            }
        });
        const ticketActivitiesCount = await prisma.ticketActivity.count();
        res.json(new InfiniteLoadingResult(ticketActivities, ticketActivitiesCount, infiniteLoadingParams));
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