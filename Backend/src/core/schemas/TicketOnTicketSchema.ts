import { TicketOnTicket } from "@prisma/client";
import Joi from "joi";

const TicketOnTicketSchema = Joi.object<TicketOnTicket>({
    connectedByTicketId: Joi
        .number()
        .required(),
    connectedToTicketId: Joi
        .number()
        .required(),
});

export default TicketOnTicketSchema;