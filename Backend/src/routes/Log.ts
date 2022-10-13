import express from 'express';
import { prisma } from "../server"

const Router = express.Router();

Router.get('/logs', async (req, res, next) => {
    try {
        const items = await prisma.log.findMany();
        res.json({ items });
    }
    catch (e) {
        next(e);
    }
});

export default Router;