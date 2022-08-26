import express from "express"
import { prisma } from "../server";
import { mapFilterQuery } from "../utils/filter";
import { mapOrderByQuery } from "../utils/orderBy";
import { PagerResult } from "../utils/pager";
const Router = express.Router();

const ITEMS_PER_PAGE = 5;

Router.get("/test", async (req, res, next) => {
    try {
        const testItems = await prisma.test.findMany({
            where: mapFilterQuery(req.query),
            orderBy: mapOrderByQuery(req.query)
        });
        const pagerResult = new PagerResult(testItems, ITEMS_PER_PAGE, parseInt((req.query.page as string | undefined) || "1"))
        res.json(pagerResult);
    }
    catch (e) {
        next(e)
    }
});

Router.get("/test/woPager", async (req, res, next) => {
    try {
        const testItems = await prisma.test.findMany({
            where: mapFilterQuery(req.query),
            orderBy: mapOrderByQuery(req.query)
        });
        res.json(testItems);
    }
    catch (e) {
        next(e)
    }
});

export default Router;