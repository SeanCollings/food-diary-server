import { preferenceColumnNameLookup } from '@/utils/modules/users-utils';

describe('users-utils', () => {
  describe('preferenceColumnNameLookup', () => {
    it('should return column name for showDayStreak', () => {
      const result = preferenceColumnNameLookup('showDayStreak');
      expect(result).toMatchInlineSnapshot(`"userPreferenceShowDayStreak"`);
    });

    it('should return column name for showWeeklyExcercise', () => {
      const result = preferenceColumnNameLookup('showWeeklyExcercise');
      expect(result).toMatchInlineSnapshot(
        `"userPreferenceShowWeeklyExcercise"`,
      );
    });

    it('should return column name for showWeeklyWater', () => {
      const result = preferenceColumnNameLookup('showWeeklyWater');
      expect(result).toMatchInlineSnapshot(`"userPreferenceShowWeeklyWater"`);
    });

    it('should cater for bad input', () => {
      const result = preferenceColumnNameLookup('anything' as any);
      expect(result).toMatchInlineSnapshot(`""`);
    });
  });
});
