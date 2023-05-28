import { Module } from "@nestjs/common";
import { TicketOnTicketController } from "./ticket-on-ticket.controller";

@Module({
	controllers: [TicketOnTicketController],
})
export class TicketOnTicketModule {}
