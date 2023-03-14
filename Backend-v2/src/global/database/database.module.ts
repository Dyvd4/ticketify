import { Module } from '@nestjs/common';
import { PrismaService } from './database.prisma.service';

@Module({
	providers: [PrismaService],
	controllers: [],
	exports: [PrismaService]
})
export class DatabaseModule { }
