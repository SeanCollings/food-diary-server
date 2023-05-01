import { MealTypes, MealTypesEnum } from '@/meals/types';
import { TRENDS_WEEK_LEGEND } from '@/trends/trends.constants';
import { TrendType } from '@/trends/types';
import { getBothDatesEqual } from '@/utils/date-utils';
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
  const mealTotals: { [key in MealTypesEnum]: number } = {
    breakfast: 0,
    snack_1: 0,
    lunch: 0,
    snack_2: 0,
    dinner: 0,
  };

  const isWeek = type === 'week';
  const legend = isWeek
    ? TRENDS_WEEK_LEGEND
    : allDates.map((_, index) => `${index + 1}`);

  const mealsPerDay = allDates.reduce((acc, date, index) => {
    const id = `day_${isWeek ? TRENDS_WEEK_LEGEND[index] : index + 1}`;
    const entry = diaryDays.find((day) => getBothDatesEqual(day.date, date));

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
        id,
        meals: [breakfast, snack1, lunch, snack2, dinner],
      });
    } else {
      acc.push({
        id,
        meals: [0, 0, 0, 0, 0],
      });
    }
    return acc;
  }, [] as { id: string; meals: number[] }[]);

  return { legend, mealTotals, mealsPerDay };
};
