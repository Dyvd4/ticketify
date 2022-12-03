import express from 'express';
import UserSettingsUpdateSchema from "@schemas/UserSettings";
import prisma from "@prisma";

const Router = express.Router();

Router.get('/userSettings', async (req, res, next) => {
    const { UserId } = req;
    try {
        const userSettings = await prisma.userSettings.findFirst({
            where: {
                userId: UserId
            }
        });
        res.json(userSettings);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/userSettings', async (req, res, next) => {
    const { UserId } = req;
    let userSettings = req.body;
    try {
        const validation = UserSettingsUpdateSchema.validate(userSettings);
        if (validation.error) return res.status(400).json({ validation });
        userSettings = validation.value;

        const updatedUserSettings = await prisma.userSettings.update({
            where: {
                userId: UserId
            },
            data: userSettings
        })
        res.json(updatedUserSettings);
    }
    catch (e) {
        next(e)
    }
});

export default Router;