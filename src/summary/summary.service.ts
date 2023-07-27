import { formatSummaryData } from '@/utils/modules/summary-utils';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { getSortedDatesInRange } from '@/utils/date-utils';

@Injectable()
export class SummaryService {
  constructor(private prisma: PrismaService) {}

  async getUserSummary(userId: string, dateFrom: string, dateTo: string) {
    const datesInRange = getSortedDatesInRange(dateFrom, dateTo);

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
