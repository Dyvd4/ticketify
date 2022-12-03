import express from "express";
import logger from "@logger";
const Router = express.Router();

Router.post("/error", async (req, res) => {
    const { error } = req.body;
    logger.error({
        message: "Client error",
        error
    });
    res.json({
        message: "Successfully saved error"
    });
});


export default Router;