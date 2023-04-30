import { formatMonthNumberYear } from '@/utils/date-utils';
import { DiaryDay } from '@prisma/client';

export const getDiaryDayEntriesPerMonth = (diaryDays: DiaryDay[]) => {
  const entries = diaryDays.reduce(
    (acc, diaryDay) => {
      const formattedDate = formatMonthNumberYear(diaryDay.date);
      const diaryDate = new Date(diaryDay.date).getDate();

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }

      acc[formattedDate].push(diaryDate);
      return acc;
    },
    {} as {
      [date: string]: number[];
    },
  );

  return entries;
};
