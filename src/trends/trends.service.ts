import { EMealType } from '@/lib/interfaces/meals';
import { PrismaService } from '@/prisma.service';
import {
  formatToServerDate,
  getDateRangeBackTillDayOfWeek,
  getMidnightISODaysInMonth,
  getMonthAndYearFromDate,
  sortDateArray,
} from '@/utils/date-utils';
import { convertTimeStringToMinutes } from '@/utils/time-utils';
import { Injectable } from '@nestjs/common';
import { DiaryDay } from '@prisma/client';
import { TRENDS_WEEK_LEGEND, WEEK_TOTAL_VALUES } from './trends.constants';
import { BeverageTypes, TrendType } from './types';

const getAllDatesForType = (type: TrendType) => {
  const today = formatToServerDate(new Date());
  let dateRangeFromToday: string[];

  if (type === 'week') {
    dateRangeFromToday = getDateRangeBackTillDayOfWeek(today, 1);
  } else {
    const [month, year] = getMonthAndYearFromDate();
    dateRangeFromToday = getMidnightISODaysInMonth(month, year);
  }

  const sortedDates = sortDateArray(dateRangeFromToday, 'asc');

  return sortedDates;
};

const getMealTrendData = (
  type: TrendType,
  allDates: string[],
  diaryDays: DiaryDay[],
) => {
  const mealTotals: { [key in EMealType]: number } = {
    breakfast: 0,
    snack_1: 0,
    lunch: 0,
    snack_2: 0,
    dinner: 0,
  };

  const legend =
    type === 'week'
      ? TRENDS_WEEK_LEGEND
      : allDates.map((_, index) => `${index + 1}`);

  const mealsPerDay = allDates.reduce((acc, date, index) => {
    const entry = diaryDays.find((day) => day.date === date);

    if (entry) {
      const breakfast = entry.hasMealBreakfast ? 1 : 0;
      const snack1 = entry.hasMealSnack1 ? 1 : 0;
      const lunch = entry.hasMealLunch ? 1 : 0;
      const snack2 = entry.hasMealSnack2 ? 1 : 0;
      const dinner = entry.hasMealDinner ? 1 : 0;

      mealTotals.breakfast += breakfast;
      mealTotals.snack_1 += snack1;
      mealTotals.lunch += lunch;
      mealTotals.snack_2 += snack2;
      mealTotals.dinner += dinner;

      acc.push({
        id: `day_${index + 1}`,
        meals: [breakfast, snack1, lunch, snack2, dinner],
      });
    } else {
      acc.push({
        id: `day_${index + 1}`,
        meals: [0, 0, 0, 0, 0],
      });
    }
    return acc;
  }, [] as { id: string; meals: number[] }[]);

  return { legend, mealTotals, mealsPerDay };
};
const getBeverageTrendData = (
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
const getExceriseTrendData = (
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
      const time = convertTimeStringToMinutes(excerciseTime);

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

@Injectable()
export class TrendsService {
  constructor(private prisma: PrismaService) {}

  async getMealTrends(userId: number, type: TrendType) {
    const allDates = getAllDatesForType(type);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId,
        date: { in: allDates },
      },
    });

    const trendData = getMealTrendData(type, allDates, diaryDays);
    return {
      totalValues: type === 'week' ? WEEK_TOTAL_VALUES : allDates.length,
      ...trendData,
    };
  }

  async getBeverageTrends(userId: number, type: TrendType) {
    const allDates = getAllDatesForType(type);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId,
        date: { in: allDates },
      },
    });

    const trendData = getBeverageTrendData(type, allDates, diaryDays);
    return trendData;
  }

  async getExcerciseTrends(userId: number, type: TrendType) {
    const allDates = getAllDatesForType(type);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId,
        date: { in: allDates },
      },
    });

    const trendData = getExceriseTrendData(type, allDates, diaryDays);
    return trendData;
  }
}
