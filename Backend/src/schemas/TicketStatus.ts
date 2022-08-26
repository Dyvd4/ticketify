import Joi from "joi";
import { TicketStatus } from "@prisma/client";

export const TicketStatusSchema = Joi.object<TicketStatus>({
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

export default TicketStatusSchema;