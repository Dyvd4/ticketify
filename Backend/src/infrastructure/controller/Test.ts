import express from "express"
import prisma from "@prisma";
import Pager from "@lib/list/Pager";
import { expressPrismaFilterArgs, expressPrismaOrderByArgs } from "@lib/list";
const Router = express.Router();

Router.get("/test", async (req, res, next) => {
    try {
        const pager = new Pager(req.query);

        const testItems = await prisma.test.findMany({
            ...pager.getPrismaArgs(),
            where: pager.getPrismaFilterArgs(),
            orderBy: pager.getPrismaOrderByArgs()
        });
        const testItemsCount = await prisma.test.count({
            where: pager.getPrismaFilterArgs(),
            orderBy: pager.getPrismaOrderByArgs()
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
            where: expressPrismaFilterArgs(req.query),
            orderBy: expressPrismaOrderByArgs(req.query)
        });
        res.json(testItems);
    }
    catch (e) {
        next(e)
    }
});

export default Router;