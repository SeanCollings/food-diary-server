import { MealContent } from '@/meals/types';
import { getAllMealEntriesPerDate } from '@/utils/diary-day-utils';
import { DiaryDay } from '@prisma/client';

describe('getAllMealEntriesPerDate', () => {
  const mockMealBreakfast = [
    { id: '1', food: 'mock_food', description: 'mock_description' },
  ] as MealContent[] as any;
  const mockMealSnack1 = [
    { id: '2', food: 'mock_food' },
  ] as MealContent[] as any;
  const mockMealLunch = [
    { id: '3', food: 'mock_food', measurement: 'mock_measurement' },
  ] as MealContent[] as any;
  const mockMealSnack2 = [
    { id: '4', food: 'mock_food' },
  ] as MealContent[] as any;
  const mockMealDinner = [
    { id: '5', food: 'mock_food' },
  ] as MealContent[] as any;

  const diaryDays: Partial<DiaryDay>[] = [
    {
      date: '2023-01-23',
      mealBreakfast: mockMealBreakfast,
      mealSnack1: mockMealSnack1,
      mealLunch: mockMealLunch,
      mealSnack2: mockMealSnack2,
      mealDinner: mockMealDinner,
    },
    {
      date: '2023-01-21',
      mealBreakfast: mockMealBreakfast,
      mealSnack1: mockMealSnack1,
      mealDinner: mockMealDinner,
    },
    {
      date: '2023-01-12',
      mealDinner: mockMealDinner,
    },
    {
      date: '2023-01-01',
      mealBreakfast: mockMealBreakfast,
    },
    {
      date: '2023-02-23',
      mealBreakfast: mockMealBreakfast,
    },
    {
      date: '2023-05-23',
      mealBreakfast: mockMealBreakfast,
      mealSnack1: mockMealSnack1,
    },
    {
      date: '2023-04-23',
      mealBreakfast: mockMealBreakfast,
      mealSnack1: mockMealSnack1,
    },
    { date: '2023-02-12', mealBreakfast: mockMealBreakfast },
    { date: '2023-02-12', mealBreakfast: mockMealBreakfast },
    {
      date: '2023-01-30',
      mealLunch: mockMealLunch,
      mealSnack2: mockMealSnack2,
      mealDinner: mockMealDinner,
    },
    {
      date: '2023-02-04',
      mealSnack1: mockMealSnack1,
      mealLunch: mockMealLunch,
    },
    {
      date: '2022-01-23',
      mealBreakfast: mockMealBreakfast,
      mealDinner: mockMealDinner,
    },
    {
      date: '2023-02-16',
      mealSnack1: mockMealSnack1,
      mealSnack2: mockMealSnack2,
    },
  ];

  it('should get all meal entries per date', () => {
    const result = getAllMealEntriesPerDate(diaryDays as any);
    expect(result).toMatchInlineSnapshot(`
      {
        "2022-01-23": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [
              {
                "food": "mock_food",
                "id": "5",
              },
            ],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-01-01": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-01-12": {
          "breakfast": {
            "contents": [],
          },
          "dinner": {
            "contents": [
              {
                "food": "mock_food",
                "id": "5",
              },
            ],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-01-21": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [
              {
                "food": "mock_food",
                "id": "5",
              },
            ],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [
              {
                "food": "mock_food",
                "id": "2",
              },
            ],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-01-23": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [
              {
                "food": "mock_food",
                "id": "5",
              },
            ],
          },
          "lunch": {
            "contents": [
              {
                "food": "mock_food",
                "id": "3",
                "measurement": "mock_measurement",
              },
            ],
          },
          "snack_1": {
            "contents": [
              {
                "food": "mock_food",
                "id": "2",
              },
            ],
          },
          "snack_2": {
            "contents": [
              {
                "food": "mock_food",
                "id": "4",
              },
            ],
          },
        },
        "2023-01-30": {
          "breakfast": {
            "contents": [],
          },
          "dinner": {
            "contents": [
              {
                "food": "mock_food",
                "id": "5",
              },
            ],
          },
          "lunch": {
            "contents": [
              {
                "food": "mock_food",
                "id": "3",
                "measurement": "mock_measurement",
              },
            ],
          },
          "snack_1": {
            "contents": [],
          },
          "snack_2": {
            "contents": [
              {
                "food": "mock_food",
                "id": "4",
              },
            ],
          },
        },
        "2023-02-04": {
          "breakfast": {
            "contents": [],
          },
          "dinner": {
            "contents": [],
          },
          "lunch": {
            "contents": [
              {
                "food": "mock_food",
                "id": "3",
                "measurement": "mock_measurement",
              },
            ],
          },
          "snack_1": {
            "contents": [
              {
                "food": "mock_food",
                "id": "2",
              },
            ],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-02-12": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-02-16": {
          "breakfast": {
            "contents": [],
          },
          "dinner": {
            "contents": [],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [
              {
                "food": "mock_food",
                "id": "2",
              },
            ],
          },
          "snack_2": {
            "contents": [
              {
                "food": "mock_food",
                "id": "4",
              },
            ],
          },
        },
        "2023-02-23": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-04-23": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [
              {
                "food": "mock_food",
                "id": "2",
              },
            ],
          },
          "snack_2": {
            "contents": [],
          },
        },
        "2023-05-23": {
          "breakfast": {
            "contents": [
              {
                "description": "mock_description",
                "food": "mock_food",
                "id": "1",
              },
            ],
          },
          "dinner": {
            "contents": [],
          },
          "lunch": {
            "contents": [],
          },
          "snack_1": {
            "contents": [
              {
                "food": "mock_food",
                "id": "2",
              },
            ],
          },
          "snack_2": {
            "contents": [],
          },
        },
      }
    `);
  });
});
