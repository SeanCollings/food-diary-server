import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string | null;

  @Expose()
  shareLink: string | null;

  @Expose()
  preferences: {
    showDayStreak: boolean;
    showWeeklyExcercise: boolean | null;
    showWeeklyWater: boolean | null;
    isProfileShared: boolean | null;
  };

  @Expose()
  stats: {
    dayStreak: number | null;
    weeklyExercise: number;
    weeklyWater: number;
  };
}
