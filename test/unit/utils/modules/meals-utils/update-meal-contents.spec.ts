import {
  UpdateContentParams,
  updateMealContent,
} from '@/utils/modules/meals-utils';

describe('meals-utils', () => {
  describe('updateMealContent', () => {
    const paramsSame: UpdateContentParams = {
      content: { id: '1', food: 'new_mock_food_1' },
      currentMealColumnName: 'mealBreakfast',
      newMealColumnName: 'mealBreakfast',
      currentHasMealContentColumn: 'hasMealBreakfast',
      newHasMealContentColumn: 'hasMealBreakfast',
      currentMealContents: [
        { id: '1', food: 'old_mock_food_1' },
        { id: '2', food: 'c_mock_food_2' },
        { id: '3', food: 'c_mock_food_3' },
      ],
      newMealContents: [
        { id: '4', food: 'n_mock_food_4' },
        { id: '5', food: 'n_mock_food_5' },
      ],
    };
    const paramsDifferent: UpdateContentParams = {
      ...paramsSame,
      newMealColumnName: 'mealDinner',
      newHasMealContentColumn: 'hasMealDinner',
    };
    const emptyCurrentContent: UpdateContentParams = {
      ...paramsSame,
      currentMealContents: undefined as any,
    };
    const emptyNewContent: UpdateContentParams = {
      ...paramsSame,
      newMealContents: undefined as any,
      newMealColumnName: 'mealDinner',
      newHasMealContentColumn: 'hasMealDinner',
    };

    it('should replace current content with new content if same key', () => {
      const result = updateMealContent(paramsSame);
      expect(result).toMatchInlineSnapshot(`
        {
          "mealBreakfast": [
            {
              "food": "new_mock_food_1",
              "id": "1",
            },
            {
              "food": "c_mock_food_2",
              "id": "2",
            },
            {
              "food": "c_mock_food_3",
              "id": "3",
            },
          ],
        }
      `);
    });

    it('should move old contents to with new content to different key if different key', () => {
      const result = updateMealContent(paramsDifferent);
      expect(result).toMatchInlineSnapshot(`
        {
          "hasMealBreakfast": true,
          "hasMealDinner": true,
          "mealBreakfast": [
            {
              "food": "c_mock_food_2",
              "id": "2",
            },
            {
              "food": "c_mock_food_3",
              "id": "3",
            },
          ],
          "mealDinner": [
            {
              "food": "n_mock_food_4",
              "id": "4",
            },
            {
              "food": "n_mock_food_5",
              "id": "5",
            },
            {
              "food": "new_mock_food_1",
              "id": "1",
            },
          ],
        }
      `);
    });

    it('should handle empty current contents', () => {
      const result = updateMealContent(emptyCurrentContent);
      expect(result).toMatchInlineSnapshot(`
        {
          "hasMealBreakfast": true,
          "mealBreakfast": [
            {
              "food": "n_mock_food_4",
              "id": "4",
            },
            {
              "food": "n_mock_food_5",
              "id": "5",
            },
            {
              "food": "new_mock_food_1",
              "id": "1",
            },
          ],
        }
      `);
    });

    it('should handle empty new contents', () => {
      const result = updateMealContent(emptyNewContent);
      expect(result).toMatchInlineSnapshot(`
        {
          "hasMealBreakfast": true,
          "hasMealDinner": true,
          "mealBreakfast": [
            {
              "food": "c_mock_food_2",
              "id": "2",
            },
            {
              "food": "c_mock_food_3",
              "id": "3",
            },
          ],
          "mealDinner": [
            {
              "food": "new_mock_food_1",
              "id": "1",
            },
          ],
        }
      `);
    });
  });
});
