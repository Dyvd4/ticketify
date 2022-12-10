import Joi from "joi";
import { TicketStatus as TicketStatusModel } from "@prisma/client";

export const TicketStatusSchema = Joi.object<TicketStatusModel>({
    id: Joi.string(),
    color: Joi.string().required(),
    name: Joi.string().required(),
    priority: Joi.number()
}).options({
    abortEarly: false
});

export enum TicketStatus {
    open = "open",
    processing = "processing",
    solved = "solved",
    putBack = "put back",
    assigned = "assigned",
    rejected = "rejected"
}

export default TicketStatusSchema;