import express from 'express';
import CommentSchema from "../schemas/Comment";
import { prisma } from "../server";

const Router = express.Router();

Router.get('/comments', async (req, res, next) => {
    try {
        const comments = await prisma.comment.findMany();
        res.json(comments);
    }
    catch (e) {
        next(e)
    }
});

Router.get('/comment/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                id
            }
        });
        res.json(comment);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/comment', async (req, res, next) => {
    let comment = req.body;
    try {
        const validation = CommentSchema.validate(comment);
        if (validation.error) return res.status(400).json({ validation });
        comment = validation.value;

        const newcomment = await prisma.comment.create({
            data: comment
        });
        res.json(newcomment);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/comment/:id', async (req, res, next) => {
    const { id } = req.params;
    let comment = req.body;
    try {
        const validation = CommentSchema.validate(comment);
        if (validation.error) return res.status(400).json({ validation });
        comment = validation.value;

        const updatedcomment = await prisma.comment.update({
            where: {
                id
            },
            data: comment
        })
        res.json(updatedcomment);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/comment/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedcomment = await prisma.comment.delete({
            where: {
                id
            }
        });
        res.json(deletedcomment);
    }
    catch (e) {
        next(e)
    }
});

export default Router;