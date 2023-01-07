import { authentication } from "@core/middlewares/Auth";
import { getParsedPrismaFilterArgs, getParsedPrismaOrderByArgs } from "@lib/list";
import InfiniteLoader from "@lib/list/InfiniteLoader";
import prisma from "@prisma";
import express from "express";

const Router = express.Router();
Router.use("/test", authentication());

Router.get("/test", async (req, res, next) => {
    try {
        const pager = new InfiniteLoader(req.query, 5);

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
            where: getParsedPrismaFilterArgs(req.query.filter as string),
            orderBy: getParsedPrismaOrderByArgs(req.query.orderBy as string)
        });
        res.json(testItems);
    }
    catch (e) {
        next(e)
    }
});

export default Router;