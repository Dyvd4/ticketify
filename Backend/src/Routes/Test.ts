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
        console.log("page",req.query.page);
        
        const pagerResult = new PagerResult(testItems, ITEMS_PER_PAGE, parseInt((req.query.page as string | undefined) || "0"))
        res.json(pagerResult);
    }
    catch (e) {
        next(e)
    }
});

// (async () => {
//     const testItems = await prisma.test.findMany({
//         where: {
//             createdAt: {

//             }
//         }
//     });
// })()

export default Router;