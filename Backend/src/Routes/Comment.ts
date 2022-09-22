import express from 'express';
import CommentSchema from "../schemas/Comment";
import commentParams from "../schemas/params/Comment";
import { prisma } from "../server";
import { mapFile } from '../utils/file';

const Router = express.Router();

Router.get('/comments', async (req, res, next) => {
    const { UserId } = req;

    try {
        let comments = await prisma.comment.findMany({
            where: {
                parentId: null
            },
            include: {
                author: {
                    include: {
                        avatar: {
                            include: {
                                file: true
                            }
                        }
                    }
                },
                childs: {
                    include: {
                        author: {
                            include: {
                                avatar: {
                                    include: {
                                        file: true
                                    }
                                }
                            }
                        },
                        interactions: true,
                        childs: true
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                interactions: true
            }
        });
        const orderBy: any = JSON.parse((req.query.orderBy || "{}") as string);
        (comments as any[]) = (comments as any[]).map(comment => {
            return {
                ...comment,
                author: {
                    ...comment.author,
                    avatar: mapFile(comment.author.avatar?.file, "base64")
                },
                childs: comment.childs.map(child => {
                    return {
                        ...child,
                        author: {
                            ...child.author,
                            avatar: mapFile(child.author.avatar?.file, "base64")
                        },
                        likes: child.interactions.filter(interaction => interaction.type === "like"),
                        dislikes: child.interactions.filter(interaction => interaction.type === "dislike"),
                        hearts: child.interactions.filter(interaction => interaction.type === "heart"),
                        liked: child.interactions.find(interaction => interaction.type === "like" && interaction.createdFromId === UserId),
                        disliked: child.interactions.find(interaction => interaction.type === "dislike" && interaction.createdFromId === UserId),
                        hearted: child.interactions.find(interaction => interaction.type === "heart" && interaction.createdFromId === UserId)
                    }
                }),
                likes: comment.interactions.filter(interaction => interaction.type === "like"),
                dislikes: comment.interactions.filter(interaction => interaction.type === "dislike"),
                hearts: comment.interactions.filter(interaction => interaction.type === "heart"),
                liked: comment.interactions.find(interaction => interaction.type === "like" && interaction.createdFromId === UserId),
                disliked: comment.interactions.find(interaction => interaction.type === "dislike" && interaction.createdFromId === UserId),
                hearted: comment.interactions.find(interaction => interaction.type === "heart" && interaction.createdFromId === UserId)
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

Router.get("/comment/newestFromCurrentUser", async (req, res, next) => {
    const { UserId } = req;
    try {
        const newestComment = await prisma.comment.findFirst({
            where: {
                authorId: UserId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.json(newestComment);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/comment', async (req, res, next) => {
    const { UserId } = req;
    let comment = commentParams(req.body);
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
    let comment = commentParams(req.body);
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