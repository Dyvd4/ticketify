import { PartialType } from "@nestjs/swagger";
import { TicketStatus as TicketStatusModel } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

type TicketStatus = Pick<TicketStatusModel, "color" | "name"> & Partial<Pick<TicketStatusModel, "priority">>

export class CreateTicketStatusDto implements TicketStatus {
	@IsString()
	name!: string;
	@IsString()
	color!: string
	@IsNumber() @IsOptional()
	priority?: number
}

export class UpdateTicketStatusDto extends PartialType(CreateTicketStatusDto) { }