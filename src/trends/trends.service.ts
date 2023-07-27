import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { WEEK_TOTAL_VALUES } from './trends.constants';
import { TrendType } from './types';
import {
  getAllDatesForType,
  getBeverageTrendData,
  getExceriseTrendData,
  getMealTrendData,
} from '@/utils/modules/trends-utils';

@Injectable()
export class TrendsService {
  constructor(private prisma: PrismaService) {}

  async getMealTrends(userId: string, type: TrendType) {
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

  async getBeverageTrends(userId: string, type: TrendType) {
    const allDates = getAllDatesForType(type);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId,
        date: { in: allDates },
      },
    });

    return getBeverageTrendData(type, allDates, diaryDays);
  }

  async getExcerciseTrends(userId: string, type: TrendType) {
    const allDates = getAllDatesForType(type);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId,
        date: { in: allDates },
      },
    });

    return getExceriseTrendData(type, allDates, diaryDays);
  }
}
