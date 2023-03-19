import { IsNumber, IsString } from "class-validator";

export class CreateTicketDueDateDto {
	@IsString()
	color!: string
	@IsNumber()
	durationInMinutes!: number
}

export class UpdateTicketDueDateDto extends CreateTicketDueDateDto { }