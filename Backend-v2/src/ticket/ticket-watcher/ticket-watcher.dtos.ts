import { TicketWatcher } from "@prisma/client";
import { IsNumber, IsString } from "class-validator";

export class CreateTicketWatcherDto implements Pick<TicketWatcher, "ticketId" | "userId"> {
	@IsString()
	userId!: string
	@IsNumber()
	ticketId!: number
}