import express from "express";
const Router = express.Router();
import User from "../schemas/User";

Router.get("/user", async (req, res, next) => {
    const { UserId } = req;
    try {
        const user = await User.findOne({ _id: UserId });
        if (!user) return res.status(404).json(null);
        res.json({
            user: {
                _id: user._id,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (e) {
        next(e);
    }
})

export default Router;