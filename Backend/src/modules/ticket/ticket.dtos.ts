import { Ticket } from "@prisma/client";
import { IsDate, IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTicketDto implements Pick<Ticket, "title" | "responsibleUserId" | "description" | "priorityId">{
	@IsString() @MaxLength(100)
	title!: string;
	@IsString() @IsOptional()
	responsibleUserId!: string | null
	@IsString()
	description!: string
	@IsDateString() @IsOptional()
	dueDate?: string
	@IsString()
	priorityId!: string;
}

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

export class SearchTicketDto implements Pick<Ticket, "title">{
	@IsString()
	title!: string;
}