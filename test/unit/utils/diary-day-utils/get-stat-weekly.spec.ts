import { getWellnessStatsPerEntries } from '@/utils/diary-day-utils';
import { DiaryDay } from '@prisma/client';

describe('getWellnessStatsPerEntries', () => {
  const diaryDays: Partial<DiaryDay>[] = [
    {
      date: '2023-01-23',
      wellnessWater: 3,
      wellnessTeaCoffee: 2,
      wellnessAlcohol: 1,
      wellnessExcercise: '01:15',
    },
    {
      date: '2023-01-21',
      wellnessWater: 7,
      wellnessTeaCoffee: 2,
      wellnessAlcohol: 1,
      wellnessExcercise: '00:15',
    },
    {
      date: '2023-01-12',
      wellnessWater: 9,
      wellnessExcercise: '00:30',
    },
    {
      date: '2023-01-01',
      wellnessWater: 3,
      wellnessTeaCoffee: 1,
      wellnessAlcohol: 0,
    },
    {
      date: '2023-02-23',
      wellnessWater: 1,
      wellnessTeaCoffee: 0,
      wellnessAlcohol: 3,
    },
    {
      date: '2023-05-23',
      wellnessTeaCoffee: 2,
      wellnessAlcohol: 2,
      wellnessExcercise: '00:30',
    },
    {
      date: '2023-04-23',
      wellnessWater: 0,
      wellnessTeaCoffee: 6,
    },
    {
      date: '2023-02-12',
      wellnessWater: 3,
      wellnessTeaCoffee: 2,
    },
    {
      date: '2023-02-12',
      wellnessWater: 4,
      wellnessExcercise: '00:30',
    },
    {
      date: '2023-01-30',
      wellnessWater: 1,
    },
    {
      date: '2023-02-04',
      wellnessWater: 2,

      wellnessAlcohol: 3,
    },
    {
      date: '2022-01-23',
      wellnessWater: 3,
      wellnessTeaCoffee: 2,
      wellnessExcercise: '00:35',
    },
    {
      date: '2023-02-16',
      wellnessWater: 3,
      wellnessTeaCoffee: 1,
      wellnessAlcohol: 8,
      wellnessExcercise: '02:30',
    },
  ];

  it('should get all wellness stats for all entries', () => {
    const result = getWellnessStatsPerEntries(diaryDays as any);
    expect(result).toMatchInlineSnapshot(`
      {
        "statsAlcohol": 18,
        "statsExercise": 365,
        "statsTeaCoffee": 18,
        "statsWater": 39,
      }
    `);
  });
});
