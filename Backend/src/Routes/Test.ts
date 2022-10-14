import express from "express"
import { prisma } from "../server";
import { prismaFilterArgs } from "../utils/filter";
import { prismaOrderByArgs } from "../utils/orderBy";
import InfiniteLoadingResult, { prismaArgs } from "../utils/List/InfiniteLoadingResult";
const Router = express.Router();

Router.get("/test", async (req, res, next) => {
    try {
        const infiniteLoadingArgs = prismaArgs(req.query);
        const testItems = await prisma.test.findMany({
            ...infiniteLoadingArgs,
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        const testItemsCount = await prisma.test.count({
            where: prismaFilterArgs(req.query),
            orderBy: prismaOrderByArgs(req.query)
        });
        const pagerResult = new InfiniteLoadingResult(testItems, testItemsCount, infiniteLoadingArgs);

        res.json(pagerResult);
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