import { PartialType } from "@nestjs/swagger";
import { TicketPriority } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketPriorityDto implements Pick<TicketPriority, "color" | "name"> {
	@IsString() @IsNotEmpty()
	color!: string;
	@IsString() @IsNotEmpty()
	name!: string
}

export class UpdateTicketPriorityDto extends PartialType(CreateTicketPriorityDto) { }