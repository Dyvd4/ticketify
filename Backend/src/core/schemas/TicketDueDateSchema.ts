import Joi from "joi";
import { TicketDueDate } from "@prisma/client";

export const TicketDueDateSchema = Joi.object<TicketDueDate>({
    color: Joi.string().required(),
    durationInMinutes: Joi.number().required()
}).options({
    abortEarly: false
});

export default TicketDueDateSchema;