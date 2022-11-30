import { MAX_SUMMARY_MONTH_RANGE } from '@/lib/constants/validation/validation.constants';
import { IsDateAfter } from '@/lib/validation/validators/is-date-after';
import { IsWithinDateRange } from '@/lib/validation/validators/is-within-date-range';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export interface RequestWithUser extends Request {
  user: { userId: number; email: string };
}

export class GetSharedSummaryQuery {
  @IsNotEmpty()
  @MinLength(36)
  @MaxLength(36)
  @IsString()
  @IsUUID()
  link: string;

  @IsNotEmpty()
  @IsDateString()
  dateFrom: string;

  @IsNotEmpty()
  @IsDateString()
  @IsDateAfter('dateFrom', { message: 'dateFrom must come before dateTo' })
  @IsWithinDateRange('dateFrom', {
    message: `dateFrom and dateTo max-range is ${MAX_SUMMARY_MONTH_RANGE} months`,
  })
  dateTo: string;
}
