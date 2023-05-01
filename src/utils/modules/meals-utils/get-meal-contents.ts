import { MealColumnKeys } from '@/diary/types';
import { MealContent } from '@/meals/dtos/create-meal-item.dto';
import { DiaryDay } from '@prisma/client';

export const getMealContents = (
  diaryDay: DiaryDay | null,
  columnName: MealColumnKeys,
) => {
  if (!diaryDay || !diaryDay[columnName]) {
    return null;
  }

  return diaryDay[columnName] as unknown as MealContent[];
};
