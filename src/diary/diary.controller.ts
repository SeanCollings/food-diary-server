import { Controller, Get, Query } from '@nestjs/common';

@Controller('diary')
export class DiaryController {
  @Get('/')
  getDiaryEntries(@Query() query) {
    const { date } = query;
    console.log('-- getDiaryEntries ::', date);
    return { date };
  }
}
