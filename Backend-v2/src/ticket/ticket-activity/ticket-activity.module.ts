import { Module } from '@nestjs/common';
import { TicketActivityController } from './ticket-activity.controller';

@Module({
	controllers: [TicketActivityController],
	providers: []
})
export class TicketActivityModule { }
