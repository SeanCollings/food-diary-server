import { MealContent } from '@/meals/dtos/create-meal-item.dto';
import { DeleteMealItemDto } from '@/meals/dtos/delete-meal-item.dto';
import { removeMealContent } from '@/utils/modules/meals-utils';

describe('meals-utils', () => {
  describe('removeMealContent', () => {
    const currentContent: MealContent[] = [
      { id: '1', food: 'mock_food_1', description: 'mock_description_1' },
      { id: '2', food: 'mock_food_2', description: 'mock_description_2' },
      { id: '3', food: 'mock_food_2', description: 'mock_description_3' },
      { id: '4', food: 'mock_food_2', description: 'mock_description_4' },
    ];
    const removeMeal: DeleteMealItemDto = {
      mealId: 'breakfast',
      id: '2',
    };

    it('should remove meal by id from meal-contents', () => {
      const result = removeMealContent(currentContent, removeMeal);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "description": "mock_description_1",
            "food": "mock_food_1",
            "id": "1",
          },
          {
            "description": "mock_description_3",
            "food": "mock_food_2",
            "id": "3",
          },
          {
            "description": "mock_description_4",
            "food": "mock_food_2",
            "id": "4",
          },
        ]
      `);
    });

    it('should return empty array if current content doesnt exist', () => {
      const result = removeMealContent(null, removeMeal);
      expect(result).toMatchInlineSnapshot(`[]`);
    });
  });
});
