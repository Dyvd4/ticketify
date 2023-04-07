import { Module } from '@nestjs/common';
import { TicketDueDateController } from './ticket-due-date.controller';

@Module({
	controllers: [TicketDueDateController],
	providers: []
})
export class TicketDueDateModule { }
