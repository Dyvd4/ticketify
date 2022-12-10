import { TicketWatcher } from "@prisma/client";
import Joi from "joi";

const TicketWatcherSchema = Joi.object<TicketWatcher>({
    ticketId: Joi
        .number()
        .required(),
    userId: Joi
        .string()
        .required(),
});

export default TicketWatcherSchema;