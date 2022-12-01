import { Module } from '@nestjs/common';
import { DiaryController } from '@/diary/diary.controller';
import { DiaryService } from '@/diary/diary.service';
import { PrismaService } from '@/prisma.service';

@Module({
  imports: [],
  controllers: [DiaryController],
  providers: [DiaryService, PrismaService],
})
export class DiaryModule {}
