import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { DiaryService } from '@/diary/diary.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  GetCalendarEntriesQuery,
  GetDiaryEntriesQuery,
  RequestWithUser,
} from '@/diary/types';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';

// https://github.com/hiro1107/nestjs-supabase-auth

// https://blog.devgenius.io/setting-up-nestjs-with-postgresql-ac2cce9045fe
// https://dev.to/andriishupta/setup-supabase-with-nestjs-2kka

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getDiaryEntries(
    @Request() req: RequestWithUser,
    @Query() query: GetDiaryEntriesQuery,
  ) {
    try {
      const { date } = query;
      return await this.diaryService.getDiaryEntries(req.user.userId, date);
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[diary::_get_]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Get('/calendar-entries')
  @UseGuards(JwtAuthGuard)
  async getCalendarEntries(
    @Request() req: RequestWithUser,
    @Query() query: GetCalendarEntriesQuery,
  ) {
    try {
      const { date, months } = query;
      return await this.diaryService.getCalendarEntries(
        req.user.userId,
        date,
        months,
      );
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[diary::_get_calendar-entries]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
