import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { CreateTicketDueDateDto, UpdateTicketDueDateDto } from "./ticket-due-date.dtos";

@Controller()
export class TicketDueDateController {
    constructor(private readonly prisma: PrismaService) {}

    @Get("ticketDueDates")
    async getTicketDueDates() {
        const { prisma } = this;
        const ticketDueDates = await prisma.ticketDueDate.findMany();
        return { items: ticketDueDates };
    }

    @Get("ticketDueDate/:id")
    async getTicketDueDate(@Param("id") id: number) {
        const { prisma } = this;
        const ticketDueDate = await prisma.ticketDueDate.findFirst({
            where: {
                durationInMinutes: id,
            },
        });

        return ticketDueDate;
    }

    @Post("ticketDueDate")
    async create(@Body() createTicketDueDateDto: CreateTicketDueDateDto) {
        const { prisma } = this;

        const newTicketDueDate = await prisma.ticketDueDate.create({
            data: createTicketDueDateDto,
        });

        return newTicketDueDate;
    }

    @Patch("ticketDueDate/:id")
    async update(
        @Param("id") id: number,
        @Body()
        updateTicketDueDateDto: UpdateTicketDueDateDto
    ) {
        const { prisma } = this;

        const updatedTicketDueDate = await prisma.ticketDueDate.update({
            where: {
                durationInMinutes: id,
            },
            data: updateTicketDueDateDto,
        });

        return updatedTicketDueDate;
    }

    @Delete("ticketDueDate/:id")
    async remove(@Param("id") id: number) {
        const { prisma } = this;

        const deletedTicketDueDate = await prisma.ticketDueDate.delete({
            where: {
                durationInMinutes: id,
            },
        });

        return deletedTicketDueDate;
    }
}
