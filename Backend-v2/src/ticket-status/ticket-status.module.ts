import { Module } from '@nestjs/common';
import { TicketStatusController } from './ticket-status.controller';

@Module({
	controllers: [TicketStatusController],
})
export class TicketStatusModule { }
