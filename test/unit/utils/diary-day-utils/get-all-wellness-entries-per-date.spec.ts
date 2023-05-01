import { getAllWellessEntriesPerDate } from '@/utils/diary-day-utils';
import { DiaryDay } from '@prisma/client';

describe('getAllWellessEntriesPerDate', () => {
  const diaryDays: Partial<DiaryDay>[] = [
    {
      date: '2023-01-23',
      wellnessWater: 3,
      wellnessTeaCoffee: 2,
      wellnessAlcohol: 1,
      wellnessExcercise: '01:15',
      wellnessExcerciseDetails: 'Run and walk',
    },
    {
      date: '2023-01-21',
      wellnessWater: 7,
      wellnessTeaCoffee: 2,
      wellnessAlcohol: 1,
      wellnessExcercise: '00:15',
      wellnessExcerciseDetails: 'Cycle',
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
      wellnessExcerciseDetails: 'Run',
    },
  ];

  it('should get all wellness entries per date', () => {
    const result = getAllWellessEntriesPerDate(diaryDays as any);
    expect(result).toMatchInlineSnapshot(`
      {
        "2022-01-23": {
          "alcohol": {
            "value": 0,
          },
          "excercise": {
            "details": "",
            "time": "00:35",
          },
          "tea_coffee": {
            "value": 2,
          },
          "water": {
            "value": 3,
          },
        },
        "2023-01-01": {
          "alcohol": {
            "value": 0,
          },
          "excercise": {
            "details": "",
            "time": "",
          },
          "tea_coffee": {
            "value": 1,
          },
          "water": {
            "value": 3,
          },
        },
        "2023-01-12": {
          "alcohol": {
            "value": 0,
          },
          "excercise": {
            "details": "",
            "time": "00:30",
          },
          "tea_coffee": {
            "value": 0,
          },
          "water": {
            "value": 9,
          },
        },
        "2023-01-21": {
          "alcohol": {
            "value": 1,
          },
          "excercise": {
            "details": "Cycle",
            "time": "00:15",
          },
          "tea_coffee": {
            "value": 2,
          },
          "water": {
            "value": 7,
          },
        },
        "2023-01-23": {
          "alcohol": {
            "value": 1,
          },
          "excercise": {
            "details": "Run and walk",
            "time": "01:15",
          },
          "tea_coffee": {
            "value": 2,
          },
          "water": {
            "value": 3,
          },
        },
        "2023-01-30": {
          "alcohol": {
            "value": 0,
          },
          "excercise": {
            "details": "",
            "time": "",
          },
          "tea_coffee": {
            "value": 0,
          },
          "water": {
            "value": 1,
          },
        },
        "2023-02-04": {
          "alcohol": {
            "value": 3,
          },
          "excercise": {
            "details": "",
            "time": "",
          },
          "tea_coffee": {
            "value": 0,
          },
          "water": {
            "value": 2,
          },
        },
        "2023-02-12": {
          "alcohol": {
            "value": 0,
          },
          "excercise": {
            "details": "",
            "time": "00:30",
          },
          "tea_coffee": {
            "value": 0,
          },
          "water": {
            "value": 4,
          },
        },
        "2023-02-16": {
          "alcohol": {
            "value": 8,
          },
          "excercise": {
            "details": "Run",
            "time": "02:30",
          },
          "tea_coffee": {
            "value": 1,
          },
          "water": {
            "value": 3,
          },
        },
        "2023-02-23": {
          "alcohol": {
            "value": 3,
          },
          "excercise": {
            "details": "",
            "time": "",
          },
          "tea_coffee": {
            "value": 0,
          },
          "water": {
            "value": 1,
          },
        },
        "2023-04-23": {
          "alcohol": {
            "value": 0,
          },
          "excercise": {
            "details": "",
            "time": "",
          },
          "tea_coffee": {
            "value": 6,
          },
          "water": {
            "value": 0,
          },
        },
        "2023-05-23": {
          "alcohol": {
            "value": 2,
          },
          "excercise": {
            "details": "",
            "time": "00:30",
          },
          "tea_coffee": {
            "value": 2,
          },
          "water": {
            "value": 0,
          },
        },
      }
    `);
  });
});
