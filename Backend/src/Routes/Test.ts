import express from "express"
import { prisma } from "../server";
const Router = express.Router();

Router.get("/test", async (req, res) => {
    return res.json("not implemented yet")
});

export default Router;