import express from "express"
import { prisma } from "../server";
import { mapFilterQuery } from "../utils/filter";
import { mapOrderByQuery } from "../utils/orderBy";
const Router = express.Router();

Router.get("/test", async (req, res, next) => {
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

// (async () => {
//     const testItems = await prisma.test.findMany({
//         where: {
//             createdAt: {

//             }
//         }
//     });
// })()

export default Router;