import { MealContent } from '@/meals/dtos/create-meal-item.dto';

export const mealContentDto_fixture: MealContent = {
  id: '1234567890123',
  food: 'Mock food',
  description: 'This is a fixture for meal content food description',
  quantity: '2 cups',
  emoji: { name: 'food_emoji', nativeSkin: 'nativeSkin' },
};

export const mealContentSimpleDto_fixture: MealContent = {
  id: '1234567890123',
  food: 'Mock food Simple',
};
