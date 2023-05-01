import { UpdatePreferencesDTO } from '@/users/dtos';
import { mapUserPreferenceUpdate } from '@/utils/modules/users-utils';

describe('users-utils', () => {
  describe('mapUserPreferenceUpdate', () => {
    const data: UpdatePreferencesDTO = {
      showDayStreak: true,
      showWeeklyExcercise: true,
      showWeeklyWater: true,
    };

    it('should return preferences lookup', () => {
      const result = mapUserPreferenceUpdate(data);
      expect(result).toMatchInlineSnapshot(`
        {
          "userPreferenceShowDayStreak": true,
          "userPreferenceShowWeeklyExcercise": true,
          "userPreferenceShowWeeklyWater": true,
        }
      `);
    });

    it('should cater for empty input', () => {
      const result = mapUserPreferenceUpdate({});
      expect(result).toMatchInlineSnapshot(`{}`);
    });
  });
});
