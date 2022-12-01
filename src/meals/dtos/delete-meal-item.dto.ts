import { MealTypes } from '@/meals/types';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MEAL_TYPE_ARRAY } from '@/meals/meals.constants';

export class DeleteMealItemDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(MEAL_TYPE_ARRAY)
  mealId: MealTypes;

  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  @MaxLength(13)
  id: string;
}
