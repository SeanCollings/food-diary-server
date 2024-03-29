import { WellnessTypesEnum } from '@/wellness/types';
import { DiaryDay } from '@prisma/client';

const DEFAULT_EMPTY_TIME = '00:00';

type WellnessEntries = {
  [key: string]: {
    [WellnessTypesEnum.WATER]: { value: number };
    [WellnessTypesEnum.TEA_COFFEE]: { value: number };
    [WellnessTypesEnum.ALCOHOL]: { value: number };
    [WellnessTypesEnum.EXCERCISE]: { time: string; details: string };
  };
};

export const getAllWellessEntriesPerDate = (diaryDays: DiaryDay[]) =>
  diaryDays.reduce((acc, entry) => {
    acc[entry.date] = {
      water: { value: entry.wellnessWater ?? 0 },
      tea_coffee: { value: entry.wellnessTeaCoffee ?? 0 },
      alcohol: { value: entry.wellnessAlcohol ?? 0 },
      excercise: {
        time: entry.wellnessExcercise || DEFAULT_EMPTY_TIME,
        details: entry.wellnessExcerciseDetails || '',
      },
    };

    return acc;
  }, {} as WellnessEntries);
