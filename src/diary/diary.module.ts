import { Module } from '@nestjs/common';
import { DiaryController } from '@/diary/diary.controller';

@Module({
  imports: [],
  controllers: [DiaryController],
  providers: [],
})
export class DiaryModule {}
