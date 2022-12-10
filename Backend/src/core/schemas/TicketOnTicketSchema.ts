import { TicketOnTicket } from "@prisma/client";
import Joi from "joi";

const TicketOnTicketSchema = Joi.object<TicketOnTicket>({
    connectedByTicketId: Joi
        .number(),
    connectedToTicketId: Joi
        .number(),
});

export default TicketOnTicketSchema;