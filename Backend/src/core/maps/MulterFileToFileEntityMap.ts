const MulterFileToFileEntityMap = (file) => {
    return {
        fileName: file.filename,
        originalFileName: file.originalname,
        mimeType: file.mimetype,
        content: file.buffer
    }
}
export default MulterFileToFileEntityMap