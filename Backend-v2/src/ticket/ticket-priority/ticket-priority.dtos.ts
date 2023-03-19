import { PartialType } from "@nestjs/swagger";
import { TicketPriority } from "@prisma/client";
import { IsString } from "class-validator";

export class CreateTicketPriorityDto implements Pick<TicketPriority, "color" | "name"> {
	@IsString()
	color!: string;
	@IsString()
	name!: string
}

export class UpdateTicketPriorityDto extends PartialType(CreateTicketPriorityDto) { }