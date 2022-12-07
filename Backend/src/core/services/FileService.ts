import fsSync from "fs";
import fs, { mkdir } from "fs/promises";
import path from "path";

const uploadPath = path.join(__dirname, "../../upload");

const fileName = (file) => `${file.id}_${file.originalFileName || ""}`;

/** @returns filePath */
export const uploadFile = async (file) => {
    if (!fsSync.existsSync(uploadPath)) await mkdir(uploadPath)
    const filePath = path.join(uploadPath, fileName(file));
    await fs.writeFile(filePath, file.content);
    return filePath;
}

export default {
    uploadFile
}