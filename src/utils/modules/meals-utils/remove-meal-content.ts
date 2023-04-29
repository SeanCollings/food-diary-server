import { MealContent } from '@/meals/dtos/create-meal-item.dto';
import { DeleteMealItemDto } from '@/meals/dtos/delete-meal-item.dto';

export const removeMealContent = (
  currentContent: MealContent[] | null,
  meal: DeleteMealItemDto,
) => {
  if (!currentContent?.length) {
    return [];
  }

  return currentContent.filter((content) => content.id !== meal.id);
};
