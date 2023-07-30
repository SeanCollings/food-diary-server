import { getBeverageTrendData } from '@/utils/modules/trends-utils';
import {
  allMontDates,
  allWeekdates,
  diaryDaysMonth,
  diaryDaysWeek,
} from './__fixtures__';

describe('trend-utils', () => {
  describe('getBeverageTrendData', () => {
    it('should get all beverage trends for week', () => {
      const result = getBeverageTrendData(
        'week',
        allWeekdates,
        diaryDaysWeek as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "beveragesPerDay": [
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 1,
              "water": 3,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 5,
            },
            {
              "alcohol": 0,
              "tea_coffee": 2,
              "water": 2,
            },
            {
              "alcohol": 1,
              "tea_coffee": 2,
              "water": 4,
            },
          ],
          "highestValue": 5,
          "legend": [
            "S",
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
          ],
        }
      `);
    });

    it('should get all beverage trends for month', () => {
      const result = getBeverageTrendData(
        'month',
        allMontDates,
        diaryDaysMonth as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "beveragesPerDay": [
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 11,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 5,
              "tea_coffee": 0,
              "water": 1,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 1,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 2,
              "tea_coffee": 0,
              "water": 5,
            },
            {
              "alcohol": 0,
              "tea_coffee": 4,
              "water": 5,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 1,
              "water": 3,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 0,
            },
            {
              "alcohol": 0,
              "tea_coffee": 0,
              "water": 5,
            },
            {
              "alcohol": 0,
              "tea_coffee": 2,
              "water": 2,
            },
            {
              "alcohol": 1,
              "tea_coffee": 2,
              "water": 4,
            },
          ],
          "highestValue": 11,
          "legend": [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
          ],
        }
      `);
    });
  });
});
