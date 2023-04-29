import { UpdatePreferencesDTO } from '@/users/dtos';
import { PreferenceColumnNames } from '@/users/types';
import { preferenceColumnNameLookup } from './column-lookup';

export const mapUserPreferenceUpdate = (
  preferences: UpdatePreferencesDTO,
): { [key in PreferenceColumnNames]?: boolean } => {
  const hasPrefDayStreak = preferences.showDayStreak !== undefined;
  const hasPrefWeeklyExercise = preferences.showWeeklyExcercise !== undefined;
  const hasPrefWeeklyWater = preferences.showWeeklyWater !== undefined;

  return {
    ...(hasPrefDayStreak
      ? {
          [preferenceColumnNameLookup('showDayStreak')]:
            preferences.showDayStreak,
        }
      : {}),
    ...(hasPrefWeeklyExercise
      ? {
          [preferenceColumnNameLookup('showWeeklyExcercise')]:
            preferences.showWeeklyExcercise,
        }
      : {}),
    ...(hasPrefWeeklyWater
      ? {
          [preferenceColumnNameLookup('showWeeklyWater')]:
            preferences.showWeeklyWater,
        }
      : {}),
  };
};
