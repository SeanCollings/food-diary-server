import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';
import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      return this.mealsService.getMealTrends(req.user.userId, query.type);
    } catch (err) {
      console.error('[trends::_get_meal-trends]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }

  @Get('/beverage-trends')
  @UseGuards(JwtAuthGuard)
  async getBeverageTrends(
    @Request() req: RequestWithUser,
    @Query() query: GetTrendsQuery,
  ) {
    try {
      return this.mealsService.getBeverageTrends(req.user.userId, query.type);
    } catch (err) {
      console.error('[trends::_get_beverage-trends]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }

  @Get('/excercise-trends')
  @UseGuards(JwtAuthGuard)
  async getExcerciseTrends(
    @Request() req: RequestWithUser,
    @Query() query: GetTrendsQuery,
  ) {
    try {
      return this.mealsService.getExcerciseTrends(req.user.userId, query.type);
    } catch (err) {
      console.error('[trends::_get_excercise-trends]:', err.message);
      throw new InternalServerErrorException(err.message || DEFAULT_ERROR_MSG);
    }
  }
}
