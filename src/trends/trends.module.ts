import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { TrendsController } from './trends.controller';
import { TrendsService } from './trends.service';

@Module({
  controllers: [TrendsController],
  providers: [TrendsService, PrismaService],
})
export class TrendsModule {}
