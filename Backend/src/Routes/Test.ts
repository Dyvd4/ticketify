import express from "express"
import { prisma } from "../server";
import { prismaFilterArgs } from "../utils/filter";
import { prismaOrderByArgs } from "../utils/orderBy";
import Pager from "../utils/List/Pager";
const Router = express.Router();

Router.get("/test", async (req, res, next) => {
    try {
        const pager = new Pager(req.query);
        const testItems = await prisma.test.findMany({
            ...pager.getPrismaArgs(),
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        const testItemsCount = await prisma.test.count({
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });

        res.json(pager.getResult(testItems, testItemsCount));
    }
    catch (e) {
        next(e)
    }
});

Router.get("/test/woPager", async (req, res, next) => {
    try {
        const testItems = await prisma.test.findMany({
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        res.json(testItems);
    }
    catch (e) {
        next(e)
    }
});

export default Router;