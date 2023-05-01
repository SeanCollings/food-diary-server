import { WellnessEntry } from '@/wellness/dtos/wellness-entry.dto';

const EXERCISE_NO_TIME = '00:00';

interface TransformedDiaryDay {
  wellnessWater: number | null;
  wellnessTeaCoffee: number | null;
  wellnessAlcohol: number | null;
  wellnessExcercise: string | null;
  wellnessExcerciseDetails: string | null;
  hasWellnessExcercise: boolean;
}

export const transformToEntryDB = (
  entry: WellnessEntry,
): TransformedDiaryDay => {
  const hasWellnessExcercise =
    (!!entry.excercise?.time?.length &&
      entry.excercise.time !== EXERCISE_NO_TIME) ||
    !!entry.excercise?.details?.length;

  return {
    wellnessWater: entry.water?.value || null,
    wellnessTeaCoffee: entry.tea_coffee?.value || null,
    wellnessAlcohol: entry.alcohol?.value || null,
    wellnessExcercise: entry.excercise?.time || '',
    wellnessExcerciseDetails: entry.excercise?.details || '',
    hasWellnessExcercise,
  };
};
