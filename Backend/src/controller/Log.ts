import Pager from "@lib/list/Pager";
import prisma from "@prisma";
import express from 'express';

const Router = express.Router();

Router.get('/logs', async (req, res, next) => {
    try {
        const pager = new Pager(req.query, 3);

        const items = await prisma.log.findMany({
            ...pager.getPrismaArgs(),
            where: pager.getPrismaFilterArgs(req.query),
            orderBy: pager.getPrismaOrderByArgs(req.query)
        });
        const itemsCount = await prisma.log.count({
            where: pager.getPrismaFilterArgs(req.query),
            orderBy: pager.getPrismaOrderByArgs(req.query)
        });

        res.json(pager.getResult(items, itemsCount));
    }
    catch (e) {
        next(e);
    }
});

export default Router;