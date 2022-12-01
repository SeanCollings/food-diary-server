import { PrismaService } from '@/prisma.service';
import {
  formatMonthNumberYear,
  getMidnightISODaysInMonth,
  getMidnightISODaysInMonthRange,
  getMonthAndYearFromDate,
  getPreviousMonthsRange,
} from '@/utils/date-utils';
import { Injectable } from '@nestjs/common';
import { DiaryDay } from '@prisma/client';

const getMealEntriesForMonth = (diaryDays: DiaryDay[]) => {
  const mealsEntries = diaryDays.reduce((acc, day) => {
    acc[day.date] = {
      breakfast: { contents: day.mealBreakfast || [] },
      snack_1: { contents: day.mealSnack1 || [] },
      lunch: { contents: day.mealLunch || [] },
      snack_2: { contents: day.mealSnack2 || [] },
      dinner: { contents: day.mealDinner || [] },
    };

    return acc;
  }, {} as any);

  return mealsEntries;
};
export const getWellessEntriesForMonth = (diaryDays: DiaryDay[]) => {
  const wellnessEntries = diaryDays.reduce((acc, entry) => {
    acc[entry.date] = {
      water: { value: entry.wellnessWater ?? 0 },
      tea_coffee: { value: entry.wellnessTeaCoffee ?? 0 },
      alcohol: { value: entry.wellnessAlcohol ?? 0 },
      excercise: {
        time: entry.wellnessExcercise || '',
        details: entry.wellnessExcerciseDetails || '',
      },
    };

    return acc;
  }, {} as any);

  return wellnessEntries;
};
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

@Injectable()
export class DiaryService {
  constructor(private prisma: PrismaService) {}

  async getDiaryEntries(date: string, userId: number) {
    const [month, year] = getMonthAndYearFromDate(date);
    const datesInMonth = getMidnightISODaysInMonth(month, year);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: { userId, AND: { date: { in: datesInMonth } } },
    });

    if (!diaryDays.length) {
      return null;
    }

    const meals = getMealEntriesForMonth(diaryDays);
    const wellness = getWellessEntriesForMonth(diaryDays);

    const transformed = { meals, wellness };

    return transformed;
  }

  async getCalendarEntries(userId: number, date: string, months: string) {
    const { monthNumberYear, serverDateRange } = getPreviousMonthsRange(
      date,
      parseInt(months),
    );
    const allDatesInRange = getMidnightISODaysInMonthRange(serverDateRange);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId,
        AND: [
          {
            date: { in: allDatesInRange },
          },
          {
            OR: [
              {
                hasMealBreakfast: true,
              },
              {
                hasMealSnack1: true,
              },
              {
                hasMealLunch: true,
              },
              {
                hasMealSnack2: true,
              },
              {
                hasMealDinner: true,
              },
              {
                hasWellnessExcercise: true,
              },
              {
                wellnessWater: { gt: 0 },
              },
              {
                wellnessTeaCoffee: { gt: 0 },
              },
              {
                wellnessAlcohol: { gt: 0 },
              },
            ],
          },
        ],
      },
      orderBy: {
        date: 'desc',
      },
    });

    const entries = getDiaryDayEntriesPerMonth(diaryDays);

    return { monthRange: monthNumberYear, entries };
  }
}
