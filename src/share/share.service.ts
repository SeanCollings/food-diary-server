import { formatSummaryData } from '@/utils/modules/summary-utils';
import { PrismaService } from '@/prisma.service';
import { createGuid } from '@/utils/string-utils';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getSortedDatesInRange } from '@/utils/date-utils';

@Injectable()
export class ShareService {
  constructor(private prisma: PrismaService) {}

  async getSharedSummary(link: string, dateFrom: string, dateTo: string) {
    const datesInRange = getSortedDatesInRange(dateFrom, dateTo);

    const shareLink = await this.prisma.shareLink.findFirst({
      where: { link, AND: { isShared: true } },
      include: { user: { select: { name: true } } },
    });

    if (!shareLink) {
      throw new Error(`Share page with link: ${link} does not exist`);
    }

    const diaryDays = await this.prisma.diaryDay.findMany({
      where: {
        userId: shareLink.userId,
        date: { in: datesInRange },
      },
    });

    const shareData = formatSummaryData(datesInRange, diaryDays);

    return {
      user: shareLink.user.name,
      dates: datesInRange,
      totalDays: datesInRange.length,
      data: { ...shareData },
    };
  }

  async generateShareLink(userId: number) {
    const shareLink = createGuid();

    try {
      await this.prisma.shareLink.upsert({
        where: { userId },
        create: {
          userId,
          link: shareLink,
          isShared: true,
        },
        update: {
          link: shareLink,
        },
      });

      return { shareLink };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new Error(
            'There is a unique constraint violation, a new ShareLink cannot be created with this userid',
          );
        }
      }
      throw e;
    }
  }

  async linkShareable(userId: number, isShared: boolean) {
    return this.prisma.shareLink.update({
      where: { userId },
      data: { isShared },
    });
  }
}
