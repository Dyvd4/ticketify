import express from 'express';
import CommentSchema from "@core/schemas/CommentSchema";
import prisma from "@prisma";
import { getInteractions, prismaIncludeParams, userHasInteracted } from '@core/services/CommentService';
import FileEntityToClientMap from '@core/maps/FileEntityToClientMap';

const Router = express.Router();

Router.get('/comments', async (req, res, next) => {
    const { UserId } = req;

    try {
        let comments = await prisma.comment.findMany({
            where: {
                parentId: null
            },
            include: prismaIncludeParams as any
        });
        const orderBy: any = JSON.parse((req.query.orderBy || "{}") as string);
        (comments as any[]) = (comments as any[]).map(comment => {
            return {
                ...comment,
                author: {
                    ...comment.author,
                    avatar: comment.author.avatar?.file
                        ? FileEntityToClientMap(comment.author.avatar.file, "base64")
                        : null
                },
                childs: comment.childs.map(child => {
                    return {
                        ...child,
                        author: {
                            ...child.author,
                            avatar: child.author.avatar?.file
                                ? FileEntityToClientMap(child.author.avatar.file, "base64")
                                : null
                        },
                        ...getInteractions(child.interactions),
                        liked: userHasInteracted(child.interactions, "like", UserId!),
                        disliked: userHasInteracted(child.interactions, "dislike", UserId!),
                        hearted: userHasInteracted(child.interactions, "heart", UserId!)
                    }
                }),
                ...getInteractions(comment.interactions),
                liked: userHasInteracted(comment.interactions, "like", UserId!),
                disliked: userHasInteracted(comment.interactions, "dislike", UserId!),
                hearted: userHasInteracted(comment.interactions, "heart", UserId!)
            }
        }).sort((a, b) => {
            if (orderBy.property === "newestFirst") {
                // @ts-ignore
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (orderBy.property === "mostLikes") {
                const aLikesLength = a.interactions.filter(interaction => interaction.type === "like").length;
                const bLikesLength = b.interactions.filter(interaction => interaction.type === "like").length;
                return bLikesLength - aLikesLength;
            }
            if (orderBy.property === "mostHearts") {
                const aHeartsLength = a.interactions.filter(interaction => interaction.type === "heart").length;
                const bHeartsLength = b.interactions.filter(interaction => interaction.type === "heart").length;
                return bHeartsLength - aHeartsLength;
            }
            return 0;
        })
        res.json(comments);
    }
    catch (e) {
        next(e)
    }
});

Router.get('/comments/:ticketId', async (req, res, next) => {
    const { UserId } = req;
    const ticketId = parseInt(req.params.ticketId);

    try {
        let comments = await prisma.comment.findMany({
            where: {
                parentId: null,
                ticketId
            },
            include: prismaIncludeParams as any
        });
        const orderBy: any = JSON.parse((req.query.orderBy || "{}") as string);
        (comments as any[]) = (comments as any[]).map(comment => {
            return {
                ...comment,
                author: {
                    ...comment.author,
                    avatar: comment.author.avatar?.file
                        ? FileEntityToClientMap(comment.author.avatar.file, "base64")
                        : null
                },
                childs: comment.childs.map(child => {
                    return {
                        ...child,
                        author: {
                            ...child.author,
                            avatar: child.author.avatar?.file
                                ? FileEntityToClientMap(child.author.avatar.file, "base64")
                                : null
                        },
                        ...getInteractions(child.interactions),
                        liked: userHasInteracted(child.interactions, "like", UserId!),
                        disliked: userHasInteracted(child.interactions, "dislike", UserId!),
                        hearted: userHasInteracted(child.interactions, "heart", UserId!)
                    }
                }),
                ...getInteractions(comment.interactions),
                liked: userHasInteracted(comment.interactions, "like", UserId!),
                disliked: userHasInteracted(comment.interactions, "dislike", UserId!),
                hearted: userHasInteracted(comment.interactions, "heart", UserId!)
            }
        }).sort((a, b) => {
            if (orderBy.property === "newestFirst") {
                // @ts-ignore
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (orderBy.property === "mostLikes") {
                const aLikesLength = a.interactions.filter(interaction => interaction.type === "like").length;
                const bLikesLength = b.interactions.filter(interaction => interaction.type === "like").length;
                return bLikesLength - aLikesLength;
            }
            if (orderBy.property === "mostHearts") {
                const aHeartsLength = a.interactions.filter(interaction => interaction.type === "heart").length;
                const bHeartsLength = b.interactions.filter(interaction => interaction.type === "heart").length;
                return bHeartsLength - aHeartsLength;
            }
            return 0;
        })
        res.json(comments);
    }
    catch (e) {
        next(e)
    }
});

Router.get("/comments/count", async (req, res, next) => {
    try {
        const count = await prisma.comment.count();
        res.json(count);
    }
    catch (e) {
        next(e)
    }
});

Router.get("/comments/count/:ticketId", async (req, res, next) => {
    const ticketId = parseInt(req.params.ticketId);
    try {
        const count = await prisma.comment.count({
            where: {
                ticketId
            }
        });
        res.json(count);
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
    const { UserId } = req;
    let comment = req.body;
    try {
        comment.authorId = UserId!;

        if (comment.parentId) {
            const parentComment = await prisma.comment.findFirst({
                where: {
                    id: comment.parentId
                }
            });
            if (parentComment?.parentId) {
                return res.status(400).json({
                    validation: {
                        message: "Parent is not allowed to have a parent"
                    }
                });
            }
        }

        const validation = CommentSchema.validate(comment);
        if (validation.error) return res.status(400).json({ validation });
        comment = validation.value;

        const newComment = await prisma.comment.create({
            data: comment
        });
        res.json(newComment);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/comment/:id', async (req, res, next) => {
    const { UserId } = req;
    const { id } = req.params;
    let comment = req.body;
    try {

        const commentDb = await prisma.comment.findFirst({
            where: {
                id
            }
        });
        if (!commentDb) return res.status(404);
        if (commentDb.authorId !== UserId) {
            return res.status(401).json({
                message: "Action is invalid because you are not the author of this comment"
            });
        }

        const validation = CommentSchema.validate(comment);
        if (validation.error) return res.status(400).json({ validation });
        comment = validation.value;

        const updatedComment = await prisma.comment.update({
            where: {
                id
            },
            data: comment
        })
        res.json(updatedComment);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/comment/:id', async (req, res, next) => {
    const { UserId } = req;
    const { id } = req.params;
    try {

        const comment = await prisma.comment.findFirst({
            where: {
                id
            }
        });
        if (!comment) return res.status(404);
        if (comment.authorId !== UserId) {
            return res.status(401).json({
                message: "Action is invalid because you are not the author of this comment"
            });
        }

        const deletedComment = await prisma.comment.delete({
            where: {
                id
            }
        });
        res.json(deletedComment);
    }
    catch (e) {
        next(e)
    }
});

export default Router;