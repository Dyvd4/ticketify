import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketActivityModule } from './ticket-activity/ticket-activity.module';
import { TicketDueDateModule } from './ticket-due-date/ticket-due-date.module';
import { TicketOnTicketModule } from './ticket-on-ticket/ticket-on-ticket.module';
import { TicketPriorityModule } from './ticket-priority/ticket-priority.module';
import { TicketStatusModule } from './ticket-status/ticket-status.module';
import { TicketWatcherModule } from './ticket-watcher/ticket-watcher.module';

@Module({
	imports: [
		TicketActivityModule,
		TicketDueDateModule,
		TicketOnTicketModule,
		TicketPriorityModule,
		TicketStatusModule,
		TicketWatcherModule
	],
	controllers: [TicketController],
	providers: [TicketService]
})
export class TicketModule { }
