import Joi from "joi";
import { TicketPriority } from "@prisma/client";

export const TicketPrioritySchema = Joi.object<TicketPriority>({
    id: Joi.string(),
    color: Joi.string().required(),
    name: Joi.string().required()
}).options({
    abortEarly: false
});

export default TicketPrioritySchema;