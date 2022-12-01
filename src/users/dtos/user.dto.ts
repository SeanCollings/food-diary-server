import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;

  @Expose()
  shareLink: string;

  @Expose()
  preferences: {
    showDayStreak: boolean;
    showWeeklyExcercise: boolean;
    showWeeklyWater: boolean;
    isProfileShared: boolean;
  };

  @Expose()
  stats: {
    dayStreak: number;
    weeklyExercise: number;
    weeklyWater: number;
  };
}
