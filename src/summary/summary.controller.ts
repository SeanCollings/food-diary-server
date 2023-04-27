import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import { Controller } from '@nestjs/common';
import {
  Get,
  InternalServerErrorException,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SummaryService } from './summary.service';
import { GetUserSummaryQuery, RequestWithUser } from './types';

@Controller('summary')
export class SummaryController {
  constructor(private summaryService: SummaryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserSummary(
    @Request() req: RequestWithUser,
    @Query() query: GetUserSummaryQuery,
  ) {
    try {
      return await this.summaryService.getUserSummary(
        req.user.userId,
        query.dateFrom,
        query.dateTo,
      );
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[summary::_get_]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
