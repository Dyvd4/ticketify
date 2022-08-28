import Joi from "joi";
import { Ticket } from "@prisma/client";

export const TicketSchema = Joi.object<Ticket>({
    id: Joi.string(),
    title: Joi.string().required(),
    responsibleUserId: Joi.string(),
    description: Joi
        .string()
        .required(),
    dueDate: Joi.date(),
    priorityId: Joi.string().required(),
    statusId: Joi.string().allow(null),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
}).options({
    abortEarly: false
});

export default TicketSchema;