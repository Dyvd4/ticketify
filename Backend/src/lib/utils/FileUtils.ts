import config from "@config";
import path from "path";

const imageTypesRegex = new RegExp(config.VALID_IMAGETYPES_REGEX);

export const isImageFile = (file: Pick<Express.Multer.File, "originalname">) => {
    const isImageFile = imageTypesRegex.test(path.extname(file.originalname).toLowerCase());
    return isImageFile;
}

export default {
    isImageFile
}