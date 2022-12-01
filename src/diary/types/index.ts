import { MAX_CALENDAR_ENTRIES_RANGE } from '@/lib/constants/validation/validation.constants';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, Max } from 'class-validator';

export interface RequestWithUser extends Request {
  user: { userId: number; email: string };
}

export class GetDiaryEntriesQuery {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}

export class GetCalendarEntriesQuery {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(MAX_CALENDAR_ENTRIES_RANGE)
  @Type(() => Number)
  months: string;
}
