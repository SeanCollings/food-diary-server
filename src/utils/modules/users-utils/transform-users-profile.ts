import { UserDto } from '@/users/dtos';
import { UserWithShareLink } from '@/users/types';
import {
  getBothDatesEqual,
  setDateToMidnight,
  setDaysFromDate,
} from '@/utils/date-utils';
import { getWellnessStatsPerEntries } from '@/utils/diary-day-utils';
import { DiaryDay } from '@prisma/client';

export const transformUserProfile = (
  userWithShareLink: UserWithShareLink,
  diaryDays: DiaryDay[],
): UserDto | null => {
  const dateNow = setDateToMidnight();

  if (!userWithShareLink) {
    return null;
  }

  const yesterday = setDaysFromDate(-1, dateNow);
  const isLastActivityTodayOrYesterday =
    getBothDatesEqual(userWithShareLink.statLastActivity, dateNow) ||
    getBothDatesEqual(userWithShareLink.statLastActivity, yesterday);
  const statDayStreak = isLastActivityTodayOrYesterday
    ? userWithShareLink.statDayStreak
    : 0;

  const { statsExercise, statsWater } = getWellnessStatsPerEntries(diaryDays);

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
      weeklyExercise: statsExercise,
      weeklyWater: statsWater,
    },
  };
};
