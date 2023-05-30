import { User } from '@prisma/client';

export const user_fixture: User = {
  id: 1234,
  email: 'test@email.com',
  password: 'password',
  name: 'Mock User',
  avatar: '',
  createdAt: new Date('2023-01-02'),
  lastLogin: new Date('2023-04-28'),
  statDayStreak: 4,
  statLastActivity: new Date('2023-04-28'),
  userPreferenceShowDayStreak: true,
  userPreferenceShowWeeklyExcercise: true,
  userPreferenceShowWeeklyWater: true,
};
