import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTicketDueDateDto {
	@IsString() @IsNotEmpty()
	color!: string
	@IsNumber()
	durationInMinutes!: number
}

export class UpdateTicketDueDateDto extends CreateTicketDueDateDto { }