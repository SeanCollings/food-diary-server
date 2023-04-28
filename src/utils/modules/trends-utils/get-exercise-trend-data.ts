import { TRENDS_WEEK_LEGEND } from '@/trends/trends.constants';
import { TrendType } from '@/trends/types';
import { convertTimeStringToMinutes } from '@/utils/time-utils';
import { DiaryDay } from '@prisma/client';

export const getExceriseTrendData = (
  type: TrendType,
  allDates: string[],
  diaryDays: DiaryDay[],
) => {
  let highestValue = 0;

  const legend =
    type === 'week'
      ? TRENDS_WEEK_LEGEND
      : allDates.map((_, index) => `${index + 1}`);

  const excercisePerDay = allDates.reduce((acc, date) => {
    const entry = diaryDays.find((day) => day.date === date);

    if (entry) {
      const excerciseTime = entry.wellnessExcercise || '';
      const time = convertTimeStringToMinutes(excerciseTime) ?? 0;

      if (time > highestValue) {
        highestValue = time;
      }

      acc.push(time);
    } else {
      acc.push(0);
    }

    return acc;
  }, [] as number[]);

  return { excercisePerDay, highestValue, legend };
};
