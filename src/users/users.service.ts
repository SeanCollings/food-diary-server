import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, ShareLink, User } from '@prisma/client';
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

  return lookup[preference];
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

const transformUserProfile = (user: User, shareLink: ShareLink): UserDto => {
  return {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    shareLink: shareLink?.link,
    preferences: {
      showDayStreak: user.userPreferenceShowDayStreak,
      showWeeklyExcercise: user.userPreferenceShowWeeklyExcercise,
      showWeeklyWater: user.userPreferenceShowWeeklyWater,
      isProfileShared: shareLink?.isShared,
    },
    stats: {
      dayStreak: user.statDayStreak ?? 0,
      weeklyExercise: user.statWeeklyExercise ?? 0,
      weeklyWater: user.statWeeklyWater ?? 0,
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

  async getUserProfile(userId: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const shareLink = await this.prisma.shareLink.findUnique({
      where: { userId },
    });

    return transformUserProfile(user, shareLink);
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
}
