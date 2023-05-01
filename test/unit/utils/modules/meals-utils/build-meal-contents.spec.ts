import {
  CreateMealItemDTO,
  MealContent,
} from '@/meals/dtos/create-meal-item.dto';
import { buildMealContent } from '@/utils/modules/meals-utils';

describe('meals-utils', () => {
  describe('buildMealContent', () => {
    const currentContent: MealContent[] = [
      { id: '1', food: 'mock_food_1', description: 'mock_description_1' },
      { id: '2', food: 'mock_food_2', description: 'mock_description_2' },
    ];
    const newContent: CreateMealItemDTO = {
      content: { id: '3', food: 'mock_food_3' },
      mealId: 'breakfast',
    };

    it('should add new content to existing content', () => {
      const result = buildMealContent(currentContent, newContent);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "description": "mock_description_1",
            "food": "mock_food_1",
            "id": "1",
          },
          {
            "description": "mock_description_2",
            "food": "mock_food_2",
            "id": "2",
          },
          {
            "food": "mock_food_3",
            "id": "3",
          },
        ]
      `);
    });

    it('should return new content if no current content', () => {
      const result = buildMealContent([], newContent);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "food": "mock_food_3",
            "id": "3",
          },
        ]
      `);
    });

    it('should return new content if null current content', () => {
      const result = buildMealContent(null, newContent);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "food": "mock_food_3",
            "id": "3",
          },
        ]
      `);
    });
  });
});
