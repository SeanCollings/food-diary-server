import { User } from '@prisma/client';

export const user_fixture: User = {
  id: 1234,
  email: 'test@email.com',
  password: 'password',
  name: 'Mock User',
  avatar: '',
  createdAt: new Date('2023-01-01T22:00:00.000Z'),
  lastLogin: new Date('2023-04-27T22:00:00.000Z'),
  statDayStreak: 4,
  statLastActivity: new Date('2023-04-27T22:00:00.000Z'),
  userPreferenceShowDayStreak: true,
  userPreferenceShowWeeklyExcercise: true,
  userPreferenceShowWeeklyWater: true,
};
