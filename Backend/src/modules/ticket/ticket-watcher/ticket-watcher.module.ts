import { Module } from '@nestjs/common';
import { TicketWatcherController } from './ticket-watcher.controller';

@Module({
	controllers: [TicketWatcherController],
})
export class TicketWatcherModule { }
