import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller } from '@nestjs/common';
import {
  Get,
  BadRequestException,
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
      return this.summaryService.getUserSummary(
        req.user.userId,
        query.dateFrom,
        query.dateTo,
      );
    } catch (err) {
      console.error('[Summary::/]:', err.message);
      throw new BadRequestException();
    }
  }
}
