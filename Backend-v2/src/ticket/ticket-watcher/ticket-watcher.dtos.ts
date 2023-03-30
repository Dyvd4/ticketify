import { TicketWatcher } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTicketWatcherDto implements Pick<TicketWatcher, "ticketId" | "userId"> {
	@IsString() @IsNotEmpty()
	userId!: string
	@IsNumber()
	ticketId!: number
}