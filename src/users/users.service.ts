import { PrismaService } from '@/prisma.service';
import {
  getBothDatesEqual,
  getDateDaysAgo,
  getInclusiveDatesBetweenDates,
  setDaysFromDate,
} from '@/utils/date-utils';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserDTO } from './dtos';
import { UpdatePreferencesDTO } from './dtos';
import { UserDto } from './dtos/user.dto';
import {
  mapUserPreferenceUpdate,
  transformUserProfile,
} from '@/utils/modules/users-utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneSelect(userId: number, select?: Prisma.UserSelect) {
    const selected = select || {};
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: selected,
    });
  }

  async getUserProfile(userId: number): Promise<UserDto | null> {
    const dateAgo = getDateDaysAgo(6);
    const past7DaysDates = getInclusiveDatesBetweenDates(dateAgo);

    const userWithShareLink = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { shareLink: { select: { link: true, isShared: true } } },
    });
    const pastDiaryDays = await this.prisma.diaryDay.findMany({
      where: { userId, AND: { date: { in: past7DaysDates } } },
    });

    return transformUserProfile(userWithShareLink, pastDiaryDays);
  }

  async updateUser(userId: number, details: UpdateUserDTO) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: details.name,
      },
    });

    return;
  }

  async updateUserPreferences(
    userId: number,
    preferences: UpdatePreferencesDTO,
  ) {
    const mapPreferenceUpdates = mapUserPreferenceUpdate(preferences);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...mapPreferenceUpdates,
      },
    });

    return;
  }

  async updateUserStreak(userId: number) {
    const today = new Date();
    const yesterday = setDaysFromDate(-1, today);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { statLastActivity: true, statDayStreak: true },
    });

    if (!user) {
      return;
    }

    const { statDayStreak, statLastActivity } = user;

    if (!getBothDatesEqual(statLastActivity, today)) {
      let currentStreak = 1;

      if (getBothDatesEqual(statLastActivity, yesterday)) {
        currentStreak = (statDayStreak ?? 0) + 1;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { statLastActivity: today, statDayStreak: currentStreak },
      });
    }
  }
}
