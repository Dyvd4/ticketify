const MulterFileToFileEntityMap = (file: Express.Multer.File) => {
    return {
        fileName: file.filename,
        originalFileName: file.originalname,
        mimeType: file.mimetype,
    }
}
export default MulterFileToFileEntityMap