import {
  formatSummaryData,
  getDatesInRange,
} from '@/utils/modules/summary-utils';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SummaryService {
  constructor(private prisma: PrismaService) {}

  async getUserSummary(userId: number, dateFrom: string, dateTo: string) {
    const datesInRange = getDatesInRange(dateFrom, dateTo);

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId,
        date: { in: datesInRange },
      },
    });

    const summaryData = formatSummaryData(datesInRange, diaryDays);

    return {
      data: { ...summaryData },
      dates: datesInRange,
      totalDays: datesInRange.length,
    };
  }
}
