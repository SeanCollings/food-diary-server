import { PrismaService } from '@/prisma.service';
import {
  getBothDatesEqual,
  getDateDaysAgo,
  getInclusiveDatesBetweenDates,
  setDaysFromDate,
} from '@/utils/date-utils';
import { convertTimeStringToMinutes } from '@/utils/time-utils';
import { Injectable } from '@nestjs/common';
import { DiaryDay, Prisma, User } from '@prisma/client';
import { UpdateUserDTO } from './dtos';
import { UpdatePreferencesDTO } from './dtos';
import { UserDto } from './dtos/user.dto';
import { PreferenceColumnNames } from './types';

const preferenceColumnNameLookup = (preference: keyof UpdatePreferencesDTO) => {
  const lookup: {
    [key in keyof UpdatePreferencesDTO]: PreferenceColumnNames;
  } = {
    showDayStreak: 'userPreferenceShowDayStreak',
    showWeeklyExcercise: 'userPreferenceShowWeeklyExcercise',
    showWeeklyWater: 'userPreferenceShowWeeklyWater',
  };

  return lookup[preference] || '';
};

const mapUserPreferenceUpdate = (
  preferences: UpdatePreferencesDTO,
): { [key in PreferenceColumnNames]?: boolean } => {
  const hasPrefDayStreak = preferences.showDayStreak !== undefined;
  const hasPrefWeeklyExercise = preferences.showWeeklyExcercise !== undefined;
  const hasPrefWeeklyWater = preferences.showWeeklyWater !== undefined;

  return {
    ...(hasPrefDayStreak
      ? {
          [preferenceColumnNameLookup('showDayStreak')]:
            preferences.showDayStreak,
        }
      : {}),
    ...(hasPrefWeeklyExercise
      ? {
          [preferenceColumnNameLookup('showWeeklyExcercise')]:
            preferences.showWeeklyExcercise,
        }
      : {}),
    ...(hasPrefWeeklyWater
      ? {
          [preferenceColumnNameLookup('showWeeklyWater')]:
            preferences.showWeeklyWater,
        }
      : {}),
  };
};

const transformUserProfile = (
  userWithShareLink:
    | (User & {
        shareLink: {
          link: string;
          isShared: boolean;
        } | null;
      })
    | null,
  diaryDays: DiaryDay[],
): UserDto | null => {
  if (!userWithShareLink) {
    return null;
  }

  const yesterday = setDaysFromDate(-1, new Date());
  const isLastActivityTodayOrYesterday =
    getBothDatesEqual(userWithShareLink.statLastActivity, new Date()) ||
    getBothDatesEqual(userWithShareLink.statLastActivity, yesterday);
  const statDayStreak = isLastActivityTodayOrYesterday
    ? userWithShareLink.statDayStreak
    : 0;

  const { statWeeklyExercise, statWeeklyWater } = diaryDays.reduce(
    (acc, day) => {
      acc.statWeeklyExercise +=
        convertTimeStringToMinutes(day.wellnessExcercise) || 0;
      acc.statWeeklyWater += day.wellnessWater || 0;

      return acc;
    },
    { statWeeklyExercise: 0, statWeeklyWater: 0 },
  );

  return {
    name: userWithShareLink.name,
    email: userWithShareLink.email,
    avatar: userWithShareLink.avatar,
    shareLink: userWithShareLink.shareLink?.link ?? null,
    preferences: {
      showDayStreak: userWithShareLink.userPreferenceShowDayStreak,
      showWeeklyExcercise: userWithShareLink.userPreferenceShowWeeklyExcercise,
      showWeeklyWater: userWithShareLink.userPreferenceShowWeeklyWater,
      isProfileShared: userWithShareLink.shareLink?.isShared ?? null,
    },
    stats: {
      dayStreak: statDayStreak,
      weeklyExercise: statWeeklyExercise,
      weeklyWater: statWeeklyWater,
    },
  };
};

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
