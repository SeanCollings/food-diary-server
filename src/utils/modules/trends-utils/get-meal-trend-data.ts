import { EMealType } from '@/lib/interfaces/meals';
import { MealTypes } from '@/meals/types';
import { TRENDS_WEEK_LEGEND } from '@/trends/trends.constants';
import { TrendType } from '@/trends/types';
import { DiaryDay } from '@prisma/client';

interface MealTrendData {
  legend: string[];
  mealTotals: {
    [key in MealTypes]: number;
  };
  mealsPerDay: {
    id: string;
    meals: number[];
  }[];
}

export const getMealTrendData = (
  type: TrendType,
  allDates: string[],
  diaryDays: DiaryDay[],
): MealTrendData => {
  const mealTotals: { [key in EMealType]: number } = {
    breakfast: 0,
    snack_1: 0,
    lunch: 0,
    snack_2: 0,
    dinner: 0,
  };

  const legend =
    type === 'week'
      ? TRENDS_WEEK_LEGEND
      : allDates.map((_, index) => `${index + 1}`);

  const mealsPerDay = allDates.reduce((acc, date, index) => {
    const entry = diaryDays.find((day) => day.date === date);

    if (entry) {
      const breakfast = entry.hasMealBreakfast ? 1 : 0;
      const snack1 = entry.hasMealSnack1 ? 1 : 0;
      const lunch = entry.hasMealLunch ? 1 : 0;
      const snack2 = entry.hasMealSnack2 ? 1 : 0;
      const dinner = entry.hasMealDinner ? 1 : 0;

      mealTotals.breakfast += breakfast;
      mealTotals.snack_1 += snack1;
      mealTotals.lunch += lunch;
      mealTotals.snack_2 += snack2;
      mealTotals.dinner += dinner;

      acc.push({
        id: `day_${index + 1}`,
        meals: [breakfast, snack1, lunch, snack2, dinner],
      });
    } else {
      acc.push({
        id: `day_${index + 1}`,
        meals: [0, 0, 0, 0, 0],
      });
    }
    return acc;
  }, [] as { id: string; meals: number[] }[]);

  return { legend, mealTotals, mealsPerDay };
};
