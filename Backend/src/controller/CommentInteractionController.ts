import { CommentInteraction } from '@prisma/client';
import express from 'express';
import CommentInteractionSchema from "@core/schemas/CommentInteractionSchema";
import prisma from "@prisma";
import { authentication } from '@core/middlewares/Auth';

const Router = express.Router();
Router.use("/commentInteraction", authentication());

Router.get('/commentInteraction', async (req, res, next) => {
    try {
        const items = await prisma.commentInteraction.findMany();
        res.json({ items });
    }
    catch (e) {
        next(e)
    }
});

Router.get('/commentInteraction/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const commentInteraction = await prisma.commentInteraction.findFirst({
            where: {
                id
            }
        });
        res.json(commentInteraction);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/commentInteraction', async (req, res, next) => {
    const { UserId } = req;
    let commentInteraction = {
        ...req.body,
        createdFromId: UserId
    };
    try {
        const validation = CommentInteractionSchema.validate(commentInteraction);
        if (validation.error) return res.status(400).json({ validation });
        commentInteraction = validation.value;

        const existingInteraction = await prisma.commentInteraction.findUnique({
            where: {
                type_createdFromId_commentId: commentInteraction
            }
        });

        await prisma.commentInteraction.deleteMany({
            where: {
                createdFromId: UserId,
                commentId: commentInteraction.commentId
            }
        });

        let newCommentInteraction: CommentInteraction | null = null;
        if (!existingInteraction) {
            newCommentInteraction = await prisma.commentInteraction.create({
                data: commentInteraction
            });
        }
        res.json(newCommentInteraction);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/commentInteraction/:id', async (req, res, next) => {
    const { id } = req.params;
    let commentInteraction = req.body;
    try {
        const validation = CommentInteractionSchema.validate(commentInteraction);
        if (validation.error) return res.status(400).json({ validation });
        commentInteraction = validation.value;

        const updatedItem = await prisma.commentInteraction.update({
            where: {
                id
            },
            data: commentInteraction
        })
        res.json(updatedItem);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/commentInteraction/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedItem = await prisma.commentInteraction.delete({
            where: {
                id
            }
        });
        res.json(deletedItem);
    }
    catch (e) {
        next(e)
    }
});

export default Router;