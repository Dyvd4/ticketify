import prisma from "@prisma";
import FileSchema from "@core/schemas/FileSchema";
import fileParams from "@schemas/params/File";
import { uploadFile } from "@core/services/FileService";
import { validateFiles, validateImageFiles, fileUpload, imageUpload } from "@lib/middlewares/FileUpload";
import express from 'express';
const Router = express.Router();

Router.get('/files', async (req, res, next) => {
    try {
        const files = await prisma.file.findMany();
        res.json({ items: files });
    }
    catch (e) {
        next(e)
    }
});

Router.get('/file/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const file = await prisma.file.findFirst({
            where: {
                id
            }
        });
        if (!file) return res.status(404);
        const filePath = await uploadFile(file);
        res.download(filePath);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/files', fileUpload, validateFiles, async (req, res, next) => {
    // no type from multer exported :(
    const files = req.files as any[];
    try {
        const filesToInsert = files.map(file => fileParams(file));
        const fileValidations = filesToInsert.map(file => {
            const validation = FileSchema.validate(file);
            if (validation.error) return validation;
        });

        if (fileValidations.some(validation => validation)) {
            return res.status(400).json({ validations: fileValidations });
        }

        const newFiles = await Promise.all(filesToInsert.map(file => {
            return prisma.file.create({
                data: file
            });
        }));
        res.json({ items: newFiles });
    }
    catch (e) {
        next(e)
    }
});

Router.post('/images', imageUpload, validateImageFiles, async (req, res, next) => {
    // no type from multer exported :(
    const files = req.files as any[];
    try {
        const filesToInsert = files.map(file => fileParams(file));
        const fileValidations = filesToInsert.map(file => {
            const validation = FileSchema.validate(file);
            if (validation.error) return validation;
        });

        if (fileValidations.some(validation => validation)) {
            return res.status(400).json({ validations: fileValidations });
        }

        const newFiles = await Promise.all(filesToInsert.map(file => {
            return prisma.file.create({
                data: file
            });
        }));
        res.json({ items: newFiles });
    }
    catch (e) {
        next(e)
    }
});

Router.put('/file/:id', fileUpload, validateFiles, async (req, res, next) => {
    const { id } = req.params;
    const file = req.files
        ? req.files[0]
        : null;
    try {
        if (!file) return res.status(400).json({ validation: { message: "You have to provide a file" } });
        const fileToUpdate = fileParams(file);
        const validation = FileSchema.validate(fileToUpdate);
        if (validation.error) return res.status(400).json({ validation });

        const updatedItem = await prisma.file.update({
            where: {
                id
            },
            data: fileToUpdate
        });
        if (!updatedItem) return res.status(404);
        const filePath = await uploadFile(file);
        res.download(filePath);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/image/:id', imageUpload, validateImageFiles, async (req, res, next) => {
    const { id } = req.params;
    const file = req.files
        ? req.files[0]
        : null;
    try {
        if (!file) return res.status(400).json({ validation: { message: "You have to provide a file" } });
        const fileToUpdate = fileParams(file);
        const validation = FileSchema.validate(fileToUpdate);
        if (validation.error) return res.status(400).json({ validation });

        const updatedItem = await prisma.file.update({
            where: {
                id
            },
            data: fileToUpdate
        })
        res.json(updatedItem);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/file/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedItem = await prisma.file.delete({
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