import { MealContent } from '@/meals/dtos/create-meal-item.dto';
import { DiaryDay } from '@prisma/client';

export const getMealContents = (
  diaryDay: DiaryDay | null,
  columnName: string,
) => {
  if (!diaryDay) {
    return null;
  }

  return diaryDay[columnName] as MealContent[];
};
