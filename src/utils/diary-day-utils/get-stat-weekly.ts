import { DiaryDay } from '@prisma/client';
import { convertTimeStringToMinutes } from '@utils/time-utils';

export const getStatWeekly = (diaryDays: DiaryDay[]) =>
  diaryDays.reduce(
    (acc, day) => {
      acc.statWeeklyExercise +=
        convertTimeStringToMinutes(day.wellnessExcercise) ?? 0;
      acc.statWeeklyWater += day.wellnessWater ?? 0;
      acc.statWeeklyAlcohol += day.wellnessAlcohol ?? 0;
      acc.statWeeklyTeaCoffee += day.wellnessTeaCoffee ?? 0;

      return acc;
    },
    {
      statWeeklyExercise: 0,
      statWeeklyWater: 0,
      statWeeklyAlcohol: 0,
      statWeeklyTeaCoffee: 0,
    },
  );
