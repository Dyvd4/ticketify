import { authentication } from "@core/middlewares/Auth";
import Pager from "@lib/list/Pager";
import prisma from "@prisma";
import express from 'express';

const Router = express.Router();

Router.get('/logs', authentication(), async (req, res, next) => {
    try {
        const pager = new Pager(req.query, 3);

        const items = await prisma.log.findMany({
            ...pager.getPrismaArgs(),
            where: pager.getPrismaFilterArgs(),
            orderBy: pager.getPrismaOrderByArgs()
        });
        const itemsCount = await prisma.log.count({
            where: pager.getPrismaFilterArgs(),
            orderBy: pager.getPrismaOrderByArgs()
        });

        res.json(pager.getResult(items, itemsCount));
    }
    catch (e) {
        next(e);
    }
});

export default Router;