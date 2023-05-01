import { getMealTrendData } from '@/utils/modules/trends-utils';
import {
  allMontDates,
  allWeekdates,
  diaryDaysMonth,
  diaryDaysWeek,
} from './__fixtures__';

describe('trend-utils', () => {
  describe('getMealTrendData', () => {
    it('should get all meal trend data for week', () => {
      const result = getMealTrendData(
        'week',
        allWeekdates,
        diaryDaysWeek as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "legend": [
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
            "S",
          ],
          "mealTotals": {
            "breakfast": 2,
            "dinner": 4,
            "lunch": 2,
            "snack_1": 2,
            "snack_2": 2,
          },
          "mealsPerDay": [
            {
              "id": "day_M",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_T",
              "meals": [
                0,
                0,
                0,
                1,
                1,
              ],
            },
            {
              "id": "day_W",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_T",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_F",
              "meals": [
                0,
                0,
                0,
                0,
                1,
              ],
            },
            {
              "id": "day_S",
              "meals": [
                1,
                1,
                1,
                0,
                1,
              ],
            },
            {
              "id": "day_S",
              "meals": [
                1,
                1,
                1,
                1,
                1,
              ],
            },
          ],
        }
      `);
    });

    it('should get all meal trend data for month', () => {
      const result = getMealTrendData(
        'month',
        allMontDates,
        diaryDaysMonth as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
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
          "mealTotals": {
            "breakfast": 8,
            "dinner": 9,
            "lunch": 6,
            "snack_1": 4,
            "snack_2": 4,
          },
          "mealsPerDay": [
            {
              "id": "day_1",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_2",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_3",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_4",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_5",
              "meals": [
                1,
                0,
                1,
                0,
                1,
              ],
            },
            {
              "id": "day_6",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_7",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_8",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_9",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_10",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_11",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_12",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_13",
              "meals": [
                1,
                0,
                1,
                0,
                1,
              ],
            },
            {
              "id": "day_14",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_15",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_16",
              "meals": [
                1,
                1,
                1,
                1,
                1,
              ],
            },
            {
              "id": "day_17",
              "meals": [
                1,
                1,
                0,
                0,
                1,
              ],
            },
            {
              "id": "day_18",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_19",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_20",
              "meals": [
                1,
                0,
                0,
                1,
                0,
              ],
            },
            {
              "id": "day_21",
              "meals": [
                1,
                0,
                1,
                0,
                1,
              ],
            },
            {
              "id": "day_22",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_23",
              "meals": [
                0,
                0,
                0,
                1,
                1,
              ],
            },
            {
              "id": "day_24",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_25",
              "meals": [
                0,
                0,
                0,
                0,
                0,
              ],
            },
            {
              "id": "day_26",
              "meals": [
                0,
                0,
                0,
                0,
                1,
              ],
            },
            {
              "id": "day_27",
              "meals": [
                1,
                1,
                1,
                0,
                1,
              ],
            },
            {
              "id": "day_28",
              "meals": [
                1,
                1,
                1,
                1,
                1,
              ],
            },
          ],
        }
      `);
    });
  });
});
