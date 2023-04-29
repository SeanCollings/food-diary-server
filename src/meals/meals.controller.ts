import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { MealsService } from '@/meals/meals.service';
import { CreateMealItemDTO } from '@/meals/dtos/create-meal-item.dto';
import {
  CreateMealEntryQuery,
  DeleteMealEntryQuery,
  RequestWithUser,
  UpdateMealEntryQuery,
} from '@/meals/types';
import { UpdateMealItemDto } from '@/meals/dtos/update-meal-item.dto';
import { DeleteMealItemDto } from './dtos/delete-meal-item.dto';
import { DEFAULT_ERROR_MSG } from '@/lib/validation/validation.constants';

@Controller('meals')
export class MealsController {
  constructor(private mealsService: MealsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createMealEntry(
    @Request() req: RequestWithUser,
    @Query() query: CreateMealEntryQuery,
    @Body() body: CreateMealItemDTO,
  ) {
    try {
      return await this.mealsService.createMealEntry(
        req.user.userId,
        query.date,
        body,
      );
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[meals::_post_]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  async updateMealEntry(
    @Request() req: RequestWithUser,
    @Query() query: UpdateMealEntryQuery,
    @Body() body: UpdateMealItemDto,
  ) {
    try {
      return await this.mealsService.updateMealEntry(
        req.user.userId,
        query.date,
        body,
      );
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[meals::_put_]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Delete('/')
  @UseGuards(JwtAuthGuard)
  async deleteMealEntry(
    @Request() req: RequestWithUser,
    @Query() query: DeleteMealEntryQuery,
    @Body() body: DeleteMealItemDto,
  ) {
    try {
      return await this.mealsService.deleteMealEntry(
        req.user.userId,
        query.date,
        body,
      );
    } catch (err) {
      const errorMessage = err.message || DEFAULT_ERROR_MSG;
      console.error('[meals::_delete_]:', errorMessage);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
