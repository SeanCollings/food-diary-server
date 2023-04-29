import { MealTypes } from '@/meals/types';
import { DiaryDay } from '@prisma/client';

export const mealColumnNameLookup = (mealType: MealTypes) => {
  const lookup: { [key in MealTypes]: keyof DiaryDay } = {
    breakfast: 'mealBreakfast',
    snack_1: 'mealSnack1',
    lunch: 'mealLunch',
    snack_2: 'mealSnack2',
    dinner: 'mealDinner',
  };

  return lookup[mealType] as string;
};

export const hasMealContentColumnLookup = (mealType: MealTypes) => {
  const lookup: {
    [key in MealTypes]: keyof Pick<
      DiaryDay,
      | 'hasMealBreakfast'
      | 'hasMealSnack1'
      | 'hasMealLunch'
      | 'hasMealSnack2'
      | 'hasMealDinner'
    >;
  } = {
    breakfast: 'hasMealBreakfast',
    snack_1: 'hasMealSnack1',
    lunch: 'hasMealLunch',
    snack_2: 'hasMealSnack2',
    dinner: 'hasMealDinner',
  };

  return lookup[mealType] as string;
};

export const mealsColumnLookup = (mealId: MealTypes) => {
  const mealColumnName = mealColumnNameLookup(mealId);
  const hasMealContentColumn = hasMealContentColumnLookup(mealId);

  return [mealColumnName, hasMealContentColumn];
};
