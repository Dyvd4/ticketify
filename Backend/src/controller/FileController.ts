import FileEntityToClientMap from "@core/maps/FileEntityToClientMap";
import MulterFileToFileEntityMap from "@core/maps/MulterFileToFileEntityMap";
import FileService, { getFilePath } from "@core/services/FileService";
import { multipleFileUpload, multipleImageUpload, singleFileUpload, singleImageUpload } from "@lib/middlewares/FileUpload";
import prisma from "@prisma";
import express from 'express';

const Router = express.Router();

Router.get('/files', async (req, res, next) => {
    try {
        const files = await prisma.file.findMany();
        res.json({ items: files.map(file => FileEntityToClientMap(file)) });
    }
    catch (e) {
        next(e)
    }
});

Router.get("/file/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const file = await prisma.file.findFirst({
            where: {
                id
            }
        });
        if (!file) return res.status(404);
        const filePath = getFilePath(file);
        res.download(filePath);
    }
    catch (e) {
        next(e)
    }
});

Router.post('/files', multipleFileUpload, async (req, res, next) => {
    const files = req.files as Express.Multer.File[];
    try {
        const validationsOrNewFiles = await FileService.validateAndCreateFiles(files.map(file => MulterFileToFileEntityMap(file)));

        if ("validations" in validationsOrNewFiles) {
            return res.status(400).json(validationsOrNewFiles);
        }

        res.json({ items: validationsOrNewFiles });
    }
    catch (e) {
        next(e)
    }
});

Router.post('/images', multipleImageUpload, async (req, res, next) => {
    const files = req.files as Express.Multer.File[];
    try {
        const validationsOrNewFiles = await FileService.validateAndCreateFiles(files.map(file => MulterFileToFileEntityMap(file)));

        if ("validations" in validationsOrNewFiles) {
            return res.status(400).json(validationsOrNewFiles);
        }

        res.json({ items: validationsOrNewFiles });
    }
    catch (e) {
        next(e)
    }
});

Router.put('/file/:id', singleFileUpload, async (req, res, next) => {
    const { id } = req.params;
    const file = req.file

    try {
        if (!file) return res.status(400).json({ validation: { message: "You have to provide a file" } });

        const fileToUpdate = MulterFileToFileEntityMap(file);
        const validationOrUpdatedFile = await FileService.validateAndUpdateFile(id, fileToUpdate);

        if ("validation" in validationOrUpdatedFile) {
            return res.status(400).json(validationOrUpdatedFile);
        }

        const filePath = getFilePath(validationOrUpdatedFile);
        res.download(filePath);
    }
    catch (e) {
        next(e)
    }
});

Router.put('/image/:id', singleImageUpload, async (req, res, next) => {
    const { id } = req.params;
    const file = req.file
    try {
        if (!file) return res.status(400).json({ validation: { message: "You have to provide a file" } });

        const fileToUpdate = MulterFileToFileEntityMap(file);
        const validationOrUpdatedFile = await FileService.validateAndUpdateFile(id, fileToUpdate);

        if ("validation" in validationOrUpdatedFile) {
            return res.status(400).json(validationOrUpdatedFile);
        }

        const filePath = getFilePath(validationOrUpdatedFile);
        res.download(filePath);
    }
    catch (e) {
        next(e)
    }
});

Router.delete('/file/:id', async (req, res, next) => {
    const { id } = req.params;
    try {

        const validationOrDeletedFile = await FileService.validateAndDeleteFile(id);

        if ("validation" in validationOrDeletedFile) {
            return res.json(400).json(validationOrDeletedFile);
        }

        res.json(validationOrDeletedFile);
    }
    catch (e) {
        next(e)
    }
});

export default Router;