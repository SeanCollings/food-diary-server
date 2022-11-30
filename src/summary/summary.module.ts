import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  controllers: [SummaryController],
  providers: [SummaryService, PrismaService],
})
export class SummaryModule {}
