import { MealContent, MealTypesEnum } from '@/meals/types';
import { DiaryDay } from '@prisma/client';

type MealEntries = {
  [key: string]: {
    [MealTypesEnum.BREAKFAST]: { contents: MealContent[] };
    [MealTypesEnum.SNACK_1]: { contents: MealContent[] };
    [MealTypesEnum.LUNCH]: { contents: MealContent[] };
    [MealTypesEnum.SNACK_2]: { contents: MealContent[] };
    [MealTypesEnum.DINNER]: { contents: MealContent[] };
  };
};

export const getMealEntriesForMonth = (diaryDays: DiaryDay[]) =>
  diaryDays.reduce((acc, day) => {
    const mealBreakfast = (day.mealBreakfast as unknown as MealContent[]) || [];
    const mealSnack1 = (day.mealSnack1 as unknown as MealContent[]) || [];
    const mealLunch = (day.mealLunch as unknown as MealContent[]) || [];
    const mealSnack2 = (day.mealSnack2 as unknown as MealContent[]) || [];
    const mealDinner = (day.mealDinner as unknown as MealContent[]) || [];

    acc[day.date] = {
      breakfast: { contents: mealBreakfast },
      snack_1: { contents: mealSnack1 },
      lunch: { contents: mealLunch },
      snack_2: { contents: mealSnack2 },
      dinner: { contents: mealDinner },
    };

    return acc;
  }, {} as MealEntries);
