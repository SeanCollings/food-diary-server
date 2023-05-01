import { DiaryDay } from '@prisma/client';
import { convertTimeStringToMinutes } from '@utils/time-utils';

export const getWellnessStatsPerEntries = (diaryDays: DiaryDay[]) =>
  diaryDays.reduce(
    (acc, day) => {
      acc.statsExercise +=
        convertTimeStringToMinutes(day.wellnessExcercise) ?? 0;
      acc.statsWater += day.wellnessWater ?? 0;
      acc.statsAlcohol += day.wellnessAlcohol ?? 0;
      acc.statsTeaCoffee += day.wellnessTeaCoffee ?? 0;

      return acc;
    },
    {
      statsExercise: 0,
      statsWater: 0,
      statsAlcohol: 0,
      statsTeaCoffee: 0,
    },
  );
