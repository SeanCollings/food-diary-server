import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { TrendsService } from './trends.service';
import { GetTrendsQuery, RequestWithUser } from './types';

@Controller('trends')
export class TrendsController {
  constructor(private mealsService: TrendsService) {}

  @Get('/meal-trends')
  @UseGuards(JwtAuthGuard)
  async getMealTrends(
    @Request() req: RequestWithUser,
    @Query() query: GetTrendsQuery,
  ) {
    return this.mealsService.getMealTrends(req.user.userId, query.type);
  }

  @Get('/beverage-trends')
  @UseGuards(JwtAuthGuard)
  async getBeverageTrends(
    @Request() req: RequestWithUser,
    @Query() query: GetTrendsQuery,
  ) {
    return this.mealsService.getBeverageTrends(req.user.userId, query.type);
  }

  @Get('/excercise-trends')
  @UseGuards(JwtAuthGuard)
  async getExcerciseTrends(
    @Request() req: RequestWithUser,
    @Query() query: GetTrendsQuery,
  ) {
    return this.mealsService.getExcerciseTrends(req.user.userId, query.type);
  }
}
