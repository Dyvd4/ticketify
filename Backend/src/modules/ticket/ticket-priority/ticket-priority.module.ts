import { Module } from "@nestjs/common";
import { TicketPriorityController } from "./ticket-priority.controller";

@Module({
	controllers: [TicketPriorityController],
})
export class TicketPriorityModule {}
