import { Module } from "@nestjs/common";
import { PinnedTicketController } from "./pinned-ticket.controller";

@Module({
    controllers: [PinnedTicketController],
    providers: [],
})
export class PinnedTicketModule {}
