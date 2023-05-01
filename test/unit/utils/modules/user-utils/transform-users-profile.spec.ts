import { UserWithShareLink } from '@/users/types';
import { transformUserProfile } from '@/utils/modules/users-utils';
import { DiaryDay } from '@prisma/client';

describe('users-utils', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1682632800000); // '2022-04-27'
  });

  describe('transformUserProfile', () => {
    const mockUserWithSharelink: Partial<UserWithShareLink> = {
      statLastActivity: new Date('2023-04-27T22:00:00.000Z'),
      name: 'Mock Name',
      email: 'test@email.com',
      avatar: '//avatar',
      shareLink: { isShared: true, link: '//link' },
      userPreferenceShowDayStreak: true,
      userPreferenceShowWeeklyExcercise: false,
      userPreferenceShowWeeklyWater: true,
      statDayStreak: 3,
    };
    const diaryDays: Partial<DiaryDay>[] = [
      {
        id: '1',
        date: '2023-04-27T22:00:00.000Z',
        wellnessWater: 3,
        wellnessExcercise: '01:15',
      },
      {
        id: '2',
        date: '2023-04-26T22:00:00.000Z',
        wellnessWater: 2,
        wellnessExcercise: '0:34',
      },
      {
        id: '3',
        date: '2023-04-26T22:00:00.000Z',
        wellnessWater: 6,
        wellnessExcercise: '02:11',
      },
    ];

    it('should transform users profile', () => {
      const result = transformUserProfile(
        mockUserWithSharelink as any,
        diaryDays as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "avatar": "//avatar",
          "email": "test@email.com",
          "name": "Mock Name",
          "preferences": {
            "isProfileShared": true,
            "showDayStreak": true,
            "showWeeklyExcercise": false,
            "showWeeklyWater": true,
          },
          "shareLink": "//link",
          "stats": {
            "dayStreak": 3,
            "weeklyExercise": 240,
            "weeklyWater": 11,
          },
        }
      `);
    });

    it('should handle last activiy yesterday', () => {
      const yesterdayActivityUser: Partial<UserWithShareLink> = {
        ...mockUserWithSharelink,
        statLastActivity: new Date('2023-04-26T22:00:00.000Z'),
      };

      const result = transformUserProfile(
        yesterdayActivityUser as any,
        diaryDays as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "avatar": "//avatar",
          "email": "test@email.com",
          "name": "Mock Name",
          "preferences": {
            "isProfileShared": true,
            "showDayStreak": true,
            "showWeeklyExcercise": false,
            "showWeeklyWater": true,
          },
          "shareLink": "//link",
          "stats": {
            "dayStreak": 3,
            "weeklyExercise": 240,
            "weeklyWater": 11,
          },
        }
      `);
    });

    it('should handle last activiy a long time ago', () => {
      const longTimeAgoActivityUser: Partial<UserWithShareLink> = {
        ...mockUserWithSharelink,
        statLastActivity: new Date('2022-04-26T22:00:00.000Z'),
      };

      const result = transformUserProfile(
        longTimeAgoActivityUser as any,
        diaryDays as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "avatar": "//avatar",
          "email": "test@email.com",
          "name": "Mock Name",
          "preferences": {
            "isProfileShared": true,
            "showDayStreak": true,
            "showWeeklyExcercise": false,
            "showWeeklyWater": true,
          },
          "shareLink": "//link",
          "stats": {
            "dayStreak": 0,
            "weeklyExercise": 240,
            "weeklyWater": 11,
          },
        }
      `);
    });

    it('should handle user without sharelink', () => {
      const noSharelinkuser: Partial<UserWithShareLink> = {
        ...mockUserWithSharelink,
        shareLink: undefined,
      };

      const result = transformUserProfile(
        noSharelinkuser as any,
        diaryDays as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "avatar": "//avatar",
          "email": "test@email.com",
          "name": "Mock Name",
          "preferences": {
            "isProfileShared": null,
            "showDayStreak": true,
            "showWeeklyExcercise": false,
            "showWeeklyWater": true,
          },
          "shareLink": null,
          "stats": {
            "dayStreak": 3,
            "weeklyExercise": 240,
            "weeklyWater": 11,
          },
        }
      `);
    });

    it('should cater for null user', () => {
      const result = transformUserProfile(null as any, diaryDays as any);
      expect(result).toBeNull();
    });
  });
});
