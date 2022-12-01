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
    return this.mealsService.createMealEntry(req.user.userId, query.date, body);
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  async updateMealEntry(
    @Request() req: RequestWithUser,
    @Query() query: UpdateMealEntryQuery,
    @Body() body: UpdateMealItemDto,
  ) {
    return this.mealsService.updateMealEntry(req.user.userId, query.date, body);
  }

  @Delete('/')
  @UseGuards(JwtAuthGuard)
  async deleteMealEntry(
    @Request() req: RequestWithUser,
    @Query() query: DeleteMealEntryQuery,
    @Body() body: DeleteMealItemDto,
  ) {
    return this.mealsService.deleteMealEntry(req.user.userId, query.date, body);
  }
}
