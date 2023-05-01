import { getExceriseTrendData } from '@/utils/modules/trends-utils';
import {
  allMontDates,
  allWeekdates,
  diaryDaysMonth,
  diaryDaysWeek,
} from './__fixtures__';

describe('trend-utils', () => {
  describe('getExceriseTrendData', () => {
    it('should get all excercise trend data for week', () => {
      const result = getExceriseTrendData(
        'week',
        allWeekdates,
        diaryDaysWeek as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "excercisePerDay": [
            0,
            15,
            0,
            0,
            90,
            60,
            75,
          ],
          "highestValue": 90,
          "legend": [
            "M",
            "T",
            "W",
            "T",
            "F",
            "S",
            "S",
          ],
        }
      `);
    });

    it('should get all excercise trend data for month', () => {
      const result = getExceriseTrendData(
        'month',
        allMontDates,
        diaryDaysMonth as any,
      );
      expect(result).toMatchInlineSnapshot(`
        {
          "excercisePerDay": [
            0,
            0,
            0,
            0,
            60,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            45,
            0,
            0,
            0,
            30,
            0,
            15,
            0,
            0,
            90,
            60,
            75,
          ],
          "highestValue": 90,
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
