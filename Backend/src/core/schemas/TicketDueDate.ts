import Joi from "joi";
import { TicketDueDate } from "@prisma/client";

export const TicketDueDateSchema = Joi.object<TicketDueDate>({
    color: Joi.string().required(),
    durationInMinutes: Joi.number().required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createUser: Joi.string(),
    updateUser: Joi.string()
}).options({
    abortEarly: false
});

export default TicketDueDateSchema;