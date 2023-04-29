import {
  CreateMealItemDTO,
  MealContent,
} from '@/meals/dtos/create-meal-item.dto';
import { UpdateMealItemDto } from '@/meals/dtos/update-meal-item.dto';

export const buildMealContent = (
  current: MealContent[] | null,
  newContent: CreateMealItemDTO | UpdateMealItemDto,
) => {
  if (!current?.length) {
    return [newContent.content];
  }

  return [...current, newContent.content];
};
