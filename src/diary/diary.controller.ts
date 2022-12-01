import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { DiaryService } from '@/diary/diary.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  GetCalendarEntriesQuery,
  GetDiaryEntriesQuery,
  RequestWithUser,
} from '@/diary/types';

// https://github.com/hiro1107/nestjs-supabase-auth

// https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe
// https://dev.to/andriishupta/setup-supabase-with-nestjs-2kka

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getDiaryEntries(
    @Query() query: GetDiaryEntriesQuery,
    @Request() req: RequestWithUser,
  ) {
    const { date } = query;
    return this.diaryService.getDiaryEntries(date, req.user.userId);
  }

  @Get('/calendar-entries')
  @UseGuards(JwtAuthGuard)
  async getCalendarEntries(
    @Request() req: RequestWithUser,
    @Query() query: GetCalendarEntriesQuery,
  ) {
    const { date, months } = query;
    return this.diaryService.getCalendarEntries(req.user.userId, date, months);
  }
}
