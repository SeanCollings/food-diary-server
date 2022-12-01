import { OmitType } from '@nestjs/mapped-types';
import { CreateMealItemDTO } from '@/meals/dtos/create-meal-item.dto';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { MealTypes } from '@/meals/types';
import { MEAL_TYPE_ARRAY } from '@/meals/meals.constants';

export class UpdateMealItemDto extends OmitType(CreateMealItemDTO, ['mealId']) {
  @IsString()
  @IsNotEmpty()
  @IsIn(MEAL_TYPE_ARRAY)
  newMealId: MealTypes;

  @IsString()
  @IsNotEmpty()
  @IsIn(MEAL_TYPE_ARRAY)
  oldMealId: MealTypes;
}
