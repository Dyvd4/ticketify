import { Ticket } from "@prisma/client";
import { IsDate, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateTicketDto implements Partial<Pick<Ticket, "title" | "responsibleUserId" | "description" | "dueDate" | "priorityId" | "statusId">>{
	@IsString() @IsOptional() @MaxLength(100)
	title?: string;
	@IsString() @IsOptional()
	responsibleUserId?: string
	@IsString() @IsOptional()
	description?: string
	@IsDate() @IsOptional()
	dueDate?: Date
	@IsString() @IsOptional()
	priorityId?: string;
	@IsString() @IsOptional()
	statusId?: string;
}

// TODO: unnecessary when providing only one update dto instead
export class UpdateTicketStatusDto implements Pick<Ticket, "statusId">{
	@IsString()
	statusId!: string;
}
