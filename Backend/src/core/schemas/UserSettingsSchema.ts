import Joi from "joi";
import { UserSettings } from "@prisma/client";

const UserSettingsUpdateSchema = Joi.object<UserSettings>({
    allowFilterItemsByUrl: Joi
        .boolean(),
    allowSortItemsByUrl: Joi
        .boolean(),
    allowFilterItemsByLocalStorage: Joi
        .boolean(),
    allowSortItemsByLocalStorage: Joi
        .boolean(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
});

export default UserSettingsUpdateSchema;