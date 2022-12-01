import { User } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: { userId: number; email: string };
}

export type PreferenceColumnNames = keyof Pick<
  User,
  | 'userPreferenceShowDayStreak'
  | 'userPreferenceShowWeeklyExcercise'
  | 'userPreferenceShowWeeklyWater'
>;
