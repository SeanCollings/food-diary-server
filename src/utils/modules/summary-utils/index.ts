import {
  getInclusiveDatesBetweenDates,
  sortDateArray,
} from '@/utils/date-utils';
import { DiaryDay } from '@prisma/client';
import { IMealContent } from '@/lib/interfaces/meals';

export const getDatesInRange = (dateFrom: string, dateTo: string) => {
  const dateRange = getInclusiveDatesBetweenDates(dateFrom, dateTo);
  const sortedDates = sortDateArray(dateRange, 'asc');

  return sortedDates;
};

export const formatMealContent = (mealContent: IMealContent[] | undefined) => {
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
      const entry = diaryDays.find((day) => day.date === date);

      if (entry) {
        acc[date] = {
          breakfast: formatMealContent(
            entry.mealBreakfast as unknown as IMealContent[],
          ),
          snack_1: formatMealContent(
            entry.mealSnack1 as unknown as IMealContent[],
          ),
          lunch: formatMealContent(
            entry.mealLunch as unknown as IMealContent[],
          ),
          snack_2: formatMealContent(
            entry.mealSnack2 as unknown as IMealContent[],
          ),
          dinner: formatMealContent(
            entry.mealDinner as unknown as IMealContent[],
          ),
          ...formatWellnessEntry(entry),
        };
      }

      return acc;
    },
    [] as {
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
