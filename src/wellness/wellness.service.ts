import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { formatToServerDate, isDateInFuture } from '@/utils/date-utils';
import { Injectable } from '@nestjs/common';
import { WellnessEntry } from './dtos/wellness-entry.dto';
import { transformToEntryDB } from '@/utils/modules/wellness-utils';

@Injectable()
export class WellnessService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async updateWellnessEntries(userId: number, entries: WellnessEntry[]) {
    let entryUpdated = false;

    const promises = await Promise.allSettled(
      entries.map(async (entry) => {
        const date = formatToServerDate(entry.date);

        if (isDateInFuture(date)) {
          return Promise.resolve();
        }

        const transformed = transformToEntryDB(entry);

        await this.prisma.diaryDay.upsert({
          where: {
            userId_date: {
              userId,
              date,
            },
          },
          create: {
            date,
            userId,
            ...transformed,
          },
          update: {
            ...transformed,
          },
        });

        entryUpdated = true;
        return Promise.resolve();
      }),
    );

    const someFulfilled = promises.some((res) => res.status === 'fulfilled');
    const firstRejected = promises.find((res) => res.status === 'rejected');

    if (someFulfilled && entryUpdated) {
      await this.usersService.updateUserStreak(userId);
    }
    if (firstRejected) {
      throw new Error((firstRejected as PromiseRejectedResult).reason);
    }

    return;
  }
}
