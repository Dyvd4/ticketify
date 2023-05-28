import { PinnedTicket } from "@prisma/client";
import { UserSignatureUnion } from "@src/modules/global/database/utility.types";
import { IsNumber } from "class-validator";

export class CreatePinnedTicketDto implements Omit<PinnedTicket, UserSignatureUnion | "userId"> {
	@IsNumber()
	ticketId!: number;
}

export class UpdateTicketDueDateDto extends CreatePinnedTicketDto {}
