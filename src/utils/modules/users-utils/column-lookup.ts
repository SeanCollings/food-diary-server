import { UpdatePreferencesDTO } from '@/users/dtos';
import { PreferenceColumnNames } from '@/users/types';

export const preferenceColumnNameLookup = (
  preference: keyof UpdatePreferencesDTO,
) => {
  const lookup: {
    [key in keyof UpdatePreferencesDTO]: PreferenceColumnNames;
  } = {
    showDayStreak: 'userPreferenceShowDayStreak',
    showWeeklyExcercise: 'userPreferenceShowWeeklyExcercise',
    showWeeklyWater: 'userPreferenceShowWeeklyWater',
  };

  return lookup[preference] || '';
};
