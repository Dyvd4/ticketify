import { TicketOnTicket } from "@prisma/client";
import { IsNumber } from "class-validator";

export class CreateTicketOnTicketDto
    implements Pick<TicketOnTicket, "connectedByTicketId" | "connectedToTicketId">
{
    @IsNumber()
    connectedByTicketId!: number;
    @IsNumber()
    connectedToTicketId!: number;
}
