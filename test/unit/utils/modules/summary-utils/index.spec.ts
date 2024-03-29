import { MealContent } from '@/meals/types';
import {
  formatMealContent,
  formatSummaryData,
  formatWellnessEntry,
} from '@/utils/modules/summary-utils';
import { DiaryDay } from '@prisma/client';

describe('summry-utils', () => {
  const mockDate = '2023-04-28';
  const mockMealBreakfast = [
    {
      id: '1',
      food: 'food',
      description: 'a long description abouth the food',
      quantity: '2 cups',
      emoji: { name: 'emoji_name', nativeSkin: 'emoji_nativeSkin' },
    },
  ] as MealContent[] as any;
  const mockMealSnack1 = [
    { id: '2', food: 'mock_food' },
  ] as MealContent[] as any;
  const mockMealLunch = [
    { id: '3', food: 'mock_food', quantity: '2 cups' },
  ] as MealContent[] as any;
  const mockMealSnack2 = [
    { id: '4', food: 'mock_food', quantity: '2' },
  ] as MealContent[] as any;
  const mockMealDinner = [
    { id: '5', food: 'mock_food' },
  ] as MealContent[] as any;

  const mealContent: MealContent[] = [
    {
      id: '1',
      food: 'mock_food_1',
      description: 'a long mock description about the food',
      quantity: '2.5 spoons',
      emoji: {
        name: 'mock_emoji_name_1',
        nativeSkin: 'mock_emoji_nativeSkin_1',
      },
    },
    { id: '2', food: 'mock_food_2', quantity: '2' },
    { id: '3', food: 'mock_food_3', quantity: '1 cup' },
  ];
  const diaryDay: DiaryDay = {
    ...mealContent,
    id: 'id_dd',
    date: '2023-04-28',
    userId: 'mock_user_id',
    wellnessWater: 4,
    wellnessTeaCoffee: 2,
    wellnessAlcohol: 1,
    wellnessExcercise: '01:15',
    wellnessExcerciseDetails: 'Run and walk',
    mealBreakfast: mockMealBreakfast,
    mealSnack1: mockMealSnack1,
    mealLunch: mockMealLunch,
    mealSnack2: mockMealSnack2,
    mealDinner: mockMealDinner,
    hasMealBreakfast: true,
    hasMealSnack1: true,
    hasMealLunch: true,
    hasMealSnack2: true,
    hasMealDinner: true,
    hasWellnessExcercise: true,
  };
  const diaryDays: DiaryDay[] = [diaryDay];

  describe('formatMealContent', () => {
    it('should format meal-content', () => {
      const result = formatMealContent(mealContent);
      expect(result).toMatchInlineSnapshot(`
        [
          "2.5 spoons - mock_food_1 (a long mock description about the food)",
          "2 - mock_food_2",
          "1 cup - mock_food_3",
        ]
      `);
    });

    it('should cater for empty meal-content', () => {
      const result = formatMealContent(null as any);
      expect(result).toBeUndefined();
    });
  });

  describe('formatWellnessEntry', () => {
    it('should format wellness entries', () => {
      const result = formatWellnessEntry(diaryDay);
      expect(result).toMatchInlineSnapshot(`
        {
          "alcohol": 1,
          "tea_coffee": 2,
          "water": 4,
        }
      `);
    });

    it('should cater for only 1 entries', () => {
      const result = formatWellnessEntry({ wellnessWater: 2 } as any);
      expect(result).toMatchInlineSnapshot(`
        {
          "alcohol": undefined,
          "tea_coffee": undefined,
          "water": 2,
        }
      `);
    });

    it('should cater for empty entries', () => {
      const result = formatWellnessEntry({} as any);
      expect(result).toMatchInlineSnapshot(`{}`);
    });
  });

  describe('formatSummaryData', () => {
    it('should format summary data', () => {
      const result = formatSummaryData([mockDate, '2023-04-27'], diaryDays);
      expect(result).toMatchInlineSnapshot(`
        {
          "2023-04-28": {
            "alcohol": 1,
            "breakfast": [
              "2 cups - food (a long description abouth the food)",
            ],
            "dinner": [
              "mock_food",
            ],
            "lunch": [
              "2 cups - mock_food",
            ],
            "snack_1": [
              "mock_food",
            ],
            "snack_2": [
              "2 - mock_food",
            ],
            "tea_coffee": 2,
            "water": 4,
          },
        }
      `);
    });

    it('should cater date with no entries date', () => {
      const result = formatSummaryData(['2023-04-27'], diaryDays);
      expect(result).toMatchInlineSnapshot(`{}`);
    });
  });
});
