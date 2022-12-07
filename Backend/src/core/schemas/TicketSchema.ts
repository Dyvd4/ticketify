import Joi from "joi";
import { Ticket } from "@prisma/client";

export const TicketSchema = Joi.object<Ticket>({
    id: Joi.number(),
    title: Joi
        .string()
        .required()
        .max(100),
    responsibleUserId: Joi.string().allow(null),
    description: Joi
        .string(),
    dueDate: Joi.date().allow(null),
    priorityId: Joi.string().required(),
    statusId: Joi.string().allow(null)
}).options({
    abortEarly: false
});

export const TicketUpdateSchema = Joi.object<Ticket>({
    title: Joi
        .string()
        .max(100),
    responsibleUserId: Joi.string().allow(null),
    description: Joi
        .string(),
    dueDate: Joi.date().allow(null),
    priorityId: Joi.string(),
    statusId: Joi.string().allow(null),
});

export default TicketSchema;