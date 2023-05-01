import {
  hasMealContentColumnLookup,
  mealColumnNameLookup,
  mealsColumnLookup,
} from '@/utils/modules/meals-utils';

describe('meals-utils', () => {
  describe('mealColumnNameLookup', () => {
    it('should return column name for meal-type breakfast', () => {
      const result = mealColumnNameLookup('breakfast');
      expect(result).toMatchInlineSnapshot(`"mealBreakfast"`);
    });
  });

  describe('hasMealContentColumnLookup', () => {
    it('should return has meal content column name for meal-type breakfast', () => {
      const result = hasMealContentColumnLookup('breakfast');
      expect(result).toMatchInlineSnapshot(`"hasMealBreakfast"`);
    });
  });

  describe('mealsColumnLookup', () => {
    it('should return both column name and has meal name for meal-type breakfast', () => {
      const result = mealsColumnLookup('breakfast');
      expect(result).toMatchInlineSnapshot(`
        [
          "mealBreakfast",
          "hasMealBreakfast",
        ]
      `);
    });

    it('should return both column name and has meal name for meal-type snack 1', () => {
      const result = mealsColumnLookup('snack_1');
      expect(result).toMatchInlineSnapshot(`
        [
          "mealSnack1",
          "hasMealSnack1",
        ]
      `);
    });

    it('should return both column name and has meal name for meal-type lunch', () => {
      const result = mealsColumnLookup('lunch');
      expect(result).toMatchInlineSnapshot(`
        [
          "mealLunch",
          "hasMealLunch",
        ]
      `);
    });

    it('should return both column name and has meal name for meal-type snack 2', () => {
      const result = mealsColumnLookup('snack_2');
      expect(result).toMatchInlineSnapshot(`
        [
          "mealSnack2",
          "hasMealSnack2",
        ]
      `);
    });

    it('should return both column name and has meal name for meal-type dinner', () => {
      const result = mealsColumnLookup('dinner');
      expect(result).toMatchInlineSnapshot(`
        [
          "mealDinner",
          "hasMealDinner",
        ]
      `);
    });
  });
});
