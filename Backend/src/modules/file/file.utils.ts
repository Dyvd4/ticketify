import path from "path";

const imageTypesRegex = new RegExp(process.env.VALID_IMAGETYPES_REGEX!);

export const isImageFile = (file: Pick<Express.Multer.File, "originalname">) => {
    const isImageFile = imageTypesRegex.test(path.extname(file.originalname).toLowerCase());
    return isImageFile;
};
