import { PrismaService } from '@/prisma.service';
import { formatToServerDate, isDateInFuture } from '@/utils/date-utils';
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
    return entries.map(async (entry) => {
      const date = formatToServerDate(entry.date);

      if (isDateInFuture(date)) {
        return;
      }

      const transformed = transformToEntryDB(entry);

      return this.prisma.diaryDay.upsert({
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
  }
}
