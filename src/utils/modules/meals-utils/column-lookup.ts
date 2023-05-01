import { HasMealColumnKeys, MealColumnKeys } from '@/diary/types';
import { MealTypes } from '@/meals/types';

export const mealColumnNameLookup = (mealType: MealTypes) => {
  const lookup: { [key in MealTypes]: MealColumnKeys } = {
    breakfast: 'mealBreakfast',
    snack_1: 'mealSnack1',
    lunch: 'mealLunch',
    snack_2: 'mealSnack2',
    dinner: 'mealDinner',
  };

  return lookup[mealType];
};

export const hasMealContentColumnLookup = (mealType: MealTypes) => {
  const lookup: {
    [key in MealTypes]: HasMealColumnKeys;
  } = {
    breakfast: 'hasMealBreakfast',
    snack_1: 'hasMealSnack1',
    lunch: 'hasMealLunch',
    snack_2: 'hasMealSnack2',
    dinner: 'hasMealDinner',
  };

  return lookup[mealType];
};

export const mealsColumnLookup = (
  mealId: MealTypes,
): [MealColumnKeys, HasMealColumnKeys] => {
  const mealColumnName = mealColumnNameLookup(mealId);
  const hasMealContentColumn = hasMealContentColumnLookup(mealId);

  return [mealColumnName, hasMealContentColumn];
};
