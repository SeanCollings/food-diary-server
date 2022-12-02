import { PrismaService } from '@/prisma.service';
import {
  formatToServerDate,
  getBothDatesEqual,
  isDateInFuture,
  setDaysFromDate,
} from '@/utils/date-utils';
import { Injectable } from '@nestjs/common';
import { DiaryDay } from '@prisma/client';
import { WellnessEntry } from './dtos/wellness-entry.dto';

const EXERCISE_NO_TIME = '00:00';

const transformToEntryDB = (entry: WellnessEntry): Partial<DiaryDay> => {
  const hasWellnessExcercise =
    (!!entry.excercise?.time.length &&
      entry.excercise?.time !== EXERCISE_NO_TIME) ||
    !!entry.excercise?.details.length;

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
  constructor(private prisma: PrismaService) {}

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

    const today = new Date();
    const yesterday = setDaysFromDate(-1, today);

    const { statDayStreak, statLastActivity } =
      await this.prisma.user.findUnique({
        where: { id: userId },
        select: { statLastActivity: true, statDayStreak: true },
      });

    if (!getBothDatesEqual(statLastActivity, today)) {
      let currentStreak = 1;

      if (getBothDatesEqual(statLastActivity, yesterday)) {
        currentStreak = statDayStreak + 1;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { statLastActivity: today, statDayStreak: currentStreak },
      });
    }

    return;
  }
}
