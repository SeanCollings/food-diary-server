import { MealContent } from '@/meals/dtos/create-meal-item.dto';
import { getMealContents } from '@/utils/modules/meals-utils';
import { DiaryDay } from '@prisma/client';

describe('meals-utils', () => {
  describe('getMealContents', () => {
    const diaryDay: Partial<DiaryDay> = {
      mealBreakfast: [{ id: '1', food: 'mock_food_1' }] as MealContent[] as any,
    };

    it('should ', () => {
      const result = getMealContents(diaryDay as any, 'mealBreakfast');
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "food": "mock_food_1",
            "id": "1",
          },
        ]
      `);
    });

    it('should return null if diaryDay is null', () => {
      const result = getMealContents(null as any, 'mealBreakfast');
      expect(result).toBeNull();
    });

    it('should return null if column not available', () => {
      const result = getMealContents({ other: {} } as any, 'mealBreakfast');
      expect(result).toBeNull();
    });
  });
});
