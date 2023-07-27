import { PrismaService } from '@/prisma.service';
import {
  getMidnightISODaysInMonth,
  getMidnightISODaysInMonthRange,
  getMonthAndYearFromDate,
  getPreviousMonthsRange,
} from '@/utils/date-utils';
import {
  getDiaryDayEntriesPerMonth,
  getAllMealEntriesPerDate,
  getAllWellessEntriesPerDate,
} from '@/utils/diary-day-utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiaryService {
  constructor(private prisma: PrismaService) {}

  async getDiaryEntries(userId: string, date: string) {
    const [month, year] = getMonthAndYearFromDate(date);
    const datesInMonth = getMidnightISODaysInMonth(month, year);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: { userId, AND: { date: { in: datesInMonth } } },
    });

    if (!diaryDays.length) {
      return null;
    }

    const meals = getAllMealEntriesPerDate(diaryDays);
    const wellness = getAllWellessEntriesPerDate(diaryDays);

    const transformed = { meals, wellness };

    return transformed;
  }

  async getCalendarEntries(userId: string, date: string, months: string) {
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
