import { DiaryDay } from '@prisma/client';
import { getBothDatesEqual } from '@/utils/date-utils';
import { MealContent } from '@/meals/types';

export const formatMealContent = (mealContent: MealContent[] | undefined) => {
  if (!mealContent) {
    return;
  }

  return mealContent.reduce((acc, content) => {
    const serving = content.serving ? `${content.serving} ` : '';
    const measurement = content.measurement ? `${content.measurement} ` : '';
    const separator = !!content.serving || !!content.measurement ? '- ' : '';
    const food = content.food;
    const description = content.description ? ` (${content.description})` : '';

    const formattedContent = `${serving}${measurement}${separator}${food}${description}`;

    acc.push(formattedContent);

    return acc;
  }, [] as string[]);
};

export const formatWellnessEntry = (entry: DiaryDay) => {
  const { wellnessWater, wellnessTeaCoffee, wellnessAlcohol } = entry;

  if (!wellnessWater && !wellnessTeaCoffee && !wellnessAlcohol) {
    return {};
  }

  return {
    water: entry.wellnessWater,
    tea_coffee: entry.wellnessTeaCoffee,
    alcohol: entry.wellnessAlcohol,
  };
};

export const formatSummaryData = (
  allDates: string[],
  diaryDays: DiaryDay[],
) => {
  const dataPerDay = allDates.reduce(
    (acc, date) => {
      const entry = diaryDays.find((day) => getBothDatesEqual(day.date, date));

      if (entry) {
        acc[date] = {
          breakfast: formatMealContent(
            entry.mealBreakfast as unknown as MealContent[],
          ),
          snack_1: formatMealContent(
            entry.mealSnack1 as unknown as MealContent[],
          ),
          lunch: formatMealContent(entry.mealLunch as unknown as MealContent[]),
          snack_2: formatMealContent(
            entry.mealSnack2 as unknown as MealContent[],
          ),
          dinner: formatMealContent(
            entry.mealDinner as unknown as MealContent[],
          ),
          ...formatWellnessEntry(entry),
        };
      }

      return acc;
    },
    {} as {
      [date: string]: {
        breakfast: string[];
        snack_1: string[];
        lunch: string[];
        snack_2: string[];
        dinner: string[];
        water: number;
        tea_coffee: number;
        alcohol: number;
      };
    }[],
  );

  return dataPerDay;
};
