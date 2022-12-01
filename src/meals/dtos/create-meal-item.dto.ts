import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MealTypes } from '@/meals/types';
import { Type } from 'class-transformer';
import {
  INPUT_MAX_LENGTH,
  TEXTAREA_MAX_LENGTH,
} from '@/lib/constants/validation/validation.constants';
import { MEAL_TYPE_ARRAY } from '@/meals/meals.constants';

export class EmojiContent {
  @IsString()
  @IsNotEmpty()
  @MaxLength(INPUT_MAX_LENGTH)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  nativeSkin: string;
}

export class MealContent {
  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  @MaxLength(13)
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(INPUT_MAX_LENGTH)
  food: string;

  @IsString()
  @MaxLength(INPUT_MAX_LENGTH)
  serving?: string;

  @IsString()
  @MaxLength(INPUT_MAX_LENGTH)
  measurement?: string;

  @IsString()
  @MaxLength(TEXTAREA_MAX_LENGTH)
  description?: string;

  @ValidateIf((object, value) => value !== null)
  @Type(() => EmojiContent)
  emoji?: EmojiContent;
}

export class CreateMealItemDTO {
  @IsString()
  @IsNotEmpty()
  @IsIn(MEAL_TYPE_ARRAY)
  mealId: MealTypes;

  @ValidateNested({ each: true })
  @Type(() => MealContent)
  content: MealContent;
}
