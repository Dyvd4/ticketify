import express, { query } from 'express';
import { prisma } from "../server"
import { prismaFilterArgs } from '../utils/filter';
import { prismaOrderByArgs } from '../utils/orderBy';
import InfiniteLoadingResult, { prismaArgs } from "../utils/List/InfiniteLoadingResult";

const Router = express.Router();

Router.get('/logs', async (req, res, next) => {
    try {
        const infiniteLoadingArgs = prismaArgs(req.query);
        const items = await prisma.log.findMany({
            ...infiniteLoadingArgs,
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        const itemsCount = await prisma.log.count({
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        const pagerResult = new InfiniteLoadingResult(items, itemsCount, infiniteLoadingArgs);

        res.json(pagerResult);
    }
    catch (e) {
        next(e);
    }
});

export default Router;