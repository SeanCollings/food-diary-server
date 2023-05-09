import { MealContent } from '@/meals/types';
import { DiaryDay } from '@prisma/client';

export const diaryDaySingle_fixture: DiaryDay = {
  id: 'diary_day_id_1',
  userId: 1234,
  date: '2023-04-27T22:00:00.000Z',
  hasMealBreakfast: true,
  hasMealSnack1: true,
  hasMealLunch: true,
  hasMealSnack2: true,
  hasMealDinner: true,
  hasWellnessExcercise: true,
  mealBreakfast: [
    { id: '11', food: 'breakfast food 1' },
    {
      id: '12',
      food: 'breakfast food 2',
      description: 'description of food',
      measurement: 'cup',
      serving: '1',
      emoji: { name: 'food_emoji', nativeSkin: 'emoji_skin' },
    },
  ] as MealContent[] as any,
  mealSnack1: [{ id: '21', food: 'snack 1 food' }] as MealContent[] as any,
  mealLunch: [
    { id: '31', food: 'lunch food 1' },
    {
      id: '32',
      food: 'lunch food 2',
      description:
        'Nice and long destription about this meal that is wonderful to read',
    },
    { id: '33', food: 'lunch food 3', serving: '4' },
  ] as MealContent[] as any,
  mealSnack2: [{ id: '41', food: 'snack 2 food' }] as MealContent[] as any,
  mealDinner: [
    {
      id: '51',
      food: 'dinner food 1',
      emoji: { name: 'emoji_food', nativeSkin: 'food_skin' },
      measurement: 'bowl',
      serving: 'half',
    },
    { id: '52', food: 'longer dinner food 2', measurement: 'plate' },
    { id: '53', food: 'dinner food 3', serving: '1/2' },
    {
      id: '54',
      food: 'dinner food 4',
      serving: '2',
      emoji: { name: 'dinner_emoji' },
    },
  ] as MealContent[] as any,
  wellnessWater: 4,
  wellnessTeaCoffee: 2,
  wellnessAlcohol: 1,
  wellnessExcercise: '01:15',
  wellnessExcerciseDetails: 'Run and walk',
};

export const diaryDays_fixture: DiaryDay[] = [
  diaryDaySingle_fixture,
  {
    id: 'diary_day_id_2',
    userId: 1234,
    date: '2023-04-25T22:00:00.000Z',
    hasMealBreakfast: true,
    hasMealSnack1: false,
    hasMealLunch: true,
    hasMealSnack2: false,
    hasMealDinner: true,
    hasWellnessExcercise: true,
    mealBreakfast: [
      {
        id: '12',
        food: 'breakfast food 2',
        description: 'description of food',
        measurement: 'cup',
        serving: '1',
        emoji: { name: 'food_emoji', nativeSkin: 'emoji_skin' },
      },
    ] as MealContent[] as any,
    mealSnack1: [],
    mealLunch: [
      { id: '31', food: 'lunch food 1' },
      {
        id: '32',
        food: 'lunch food 2',
        description:
          'Nice and long destription about this meal that is wonderful to read',
      },
    ] as MealContent[] as any,
    mealSnack2: [],
    mealDinner: [
      {
        id: '51',
        food: 'dinner food 1',
        emoji: { name: 'emoji_food', nativeSkin: 'food_skin' },
        measurement: 'bowl',
        serving: 'half',
      },
    ] as MealContent[] as any,
    wellnessWater: 4,
    wellnessTeaCoffee: 0,
    wellnessAlcohol: 0,
    wellnessExcercise: '00:35',
    wellnessExcerciseDetails: null,
  },
  {
    id: 'diary_day_id_3',
    userId: 1234,
    date: '2023-04-22T22:00:00.000Z',
    hasMealBreakfast: true,
    hasMealSnack1: false,
    hasMealLunch: false,
    hasMealSnack2: false,
    hasMealDinner: true,
    hasWellnessExcercise: false,
    mealBreakfast: [
      {
        id: '12',
        food: 'breakfast food 2',
        description: 'description of food',
        measurement: 'cup',
        serving: '1',
        emoji: { name: 'food_emoji', nativeSkin: 'emoji_skin' },
      },
    ] as MealContent[] as any,
    mealSnack1: [],
    mealLunch: [],
    mealSnack2: [],
    mealDinner: [
      {
        id: '51',
        food: 'dinner food 1',
        emoji: { name: 'emoji_food', nativeSkin: 'food_skin' },
        measurement: 'bowl',
        serving: 'half',
      },
    ] as MealContent[] as any,
    wellnessWater: 2,
    wellnessTeaCoffee: 0,
    wellnessAlcohol: 0,
    wellnessExcercise: null,
    wellnessExcerciseDetails: null,
  },
];
