import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { formatToServerDate, isDateInFuture } from '@/utils/date-utils';
import { Injectable } from '@nestjs/common';
import { WellnessEntry } from './dtos/wellness-entry.dto';

const EXERCISE_NO_TIME = '00:00';

interface TransformedDiaryDay {
  wellnessWater: number | null;
  wellnessTeaCoffee: number | null;
  wellnessAlcohol: number | null;
  wellnessExcercise: string | null;
  wellnessExcerciseDetails: string | null;
  hasWellnessExcercise: boolean;
}

const transformToEntryDB = (entry: WellnessEntry): TransformedDiaryDay => {
  const hasWellnessExcercise =
    (!!entry.excercise?.time.length &&
      entry.excercise?.time !== EXERCISE_NO_TIME) ||
    !!entry.excercise?.details?.length;

  return {
    wellnessWater: entry.water?.value || null,
    wellnessTeaCoffee: entry.tea_coffee?.value || null,
    wellnessAlcohol: entry.alcohol?.value || null,
    wellnessExcercise: entry.excercise?.time || '',
    wellnessExcerciseDetails: entry.excercise?.details || '',
    hasWellnessExcercise,
  };
};

@Injectable()
export class WellnessService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async updateWellnessEntries(userId: number, entries: WellnessEntry[]) {
    entries.forEach(async (entry) => {
      const date = formatToServerDate(entry.date);

      if (isDateInFuture(date)) {
        return;
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
    });

    return await this.usersService.updateUserStreak(userId);
  }
}
