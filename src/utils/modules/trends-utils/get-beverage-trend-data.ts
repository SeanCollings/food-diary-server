import { TRENDS_WEEK_LEGEND } from '@/trends/trends.constants';
import { BeverageTypes, TrendType } from '@/trends/types';
import { DiaryDay } from '@prisma/client';

export const getBeverageTrendData = (
  type: TrendType,
  allDates: string[],
  diaryDays: DiaryDay[],
) => {
  let highestValue = 0;
  const defaultDay: {
    [key in BeverageTypes]: number;
  } = {
    water: 0,
    tea_coffee: 0,
    alcohol: 0,
  };

  const legend =
    type === 'week'
      ? TRENDS_WEEK_LEGEND
      : allDates.map((_, index) => `${index + 1}`);

  const beveragesPerDay = allDates.reduce((acc, date) => {
    const entry = diaryDays.find((day) => day.date === date);

    if (entry) {
      const water = entry.wellnessWater ?? 0;
      const tea_coffee = entry.wellnessTeaCoffee ?? 0;
      const alcohol = entry.wellnessAlcohol ?? 0;
      const highestValueInEntry = Math.max(...[water, tea_coffee, alcohol]);

      if (highestValueInEntry > highestValue) {
        highestValue = highestValueInEntry;
      }

      acc.push({
        water,
        tea_coffee,
        alcohol,
      });
    } else {
      acc.push(defaultDay);
    }

    return acc;
  }, [] as { [key in BeverageTypes]: number }[]);

  return { beveragesPerDay, highestValue, legend };
};
