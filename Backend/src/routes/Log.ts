import express, { query } from 'express';
import { prisma } from "../server"
import { prismaFilterArgs } from '../utils/filter';
import { prismaOrderByArgs } from '../utils/orderBy';
import Pager from "../utils/List/Pager";

const Router = express.Router();

Router.get('/logs', async (req, res, next) => {
    try {
        const pager = new Pager(req.query, 3);

        const items = await prisma.log.findMany({
            ...pager.getPrismaArgs(),
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        const itemsCount = await prisma.log.count({
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        
        res.json(pager.getResult(items, itemsCount));
    }
    catch (e) {
        next(e);
    }
});

export default Router;