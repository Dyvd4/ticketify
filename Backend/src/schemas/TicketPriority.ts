import Joi from "joi";
import { TicketPriority } from "@prisma/client";

export const TicketPrioritySchema = Joi.object<TicketPriority>({
    id: Joi.string(),
    color: Joi.string().required(),
    name: Joi.string().required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
}).options({
    abortEarly: false
});

export default TicketPrioritySchema;