import {
  dateNow,
  getBothDatesEqual,
  getDateDaysAgo,
  getDateMonthsAgo,
  getDateRangeBackTillDayOfWeek,
  getInclusiveDatesBetweenDates,
  getMidnightISODaysInMonth,
  getMidnightISODaysInMonthRange,
  getMonthAndYearFromDate,
  getNewMonth,
  getPreviousMonthsRange,
  getSortedDatesInRange,
  isDateInFuture,
  setDateMidnightISOString,
  sortDateArray,
} from '@/utils/date-utils';
import { setDateToMidnight } from '@/utils/date-utils';
import {
  formatMonthNumberYear,
  formatToServerDate,
  setDaysFromDate,
} from '@/utils/date-utils';

describe('date-utils', () => {
  const mockDate = '2023-04-28';
  const mockSimpleDate = '2022-02-12';
  const mockDateNotMidnight = '2023-04-28';

  /******************************** FORMAT ***********************************/
  describe('formatToServerDate', () => {
    it('should format zero-hour server date', () => {
      const result = formatToServerDate(mockDateNotMidnight);
      expect(result).toMatchInlineSnapshot(`"2023-04-28"`);
    });
  });

  describe('formatMonthNumberYear', () => {
    it('should convert date to format 11-2022', () => {
      const result = formatMonthNumberYear(mockDate);
      expect(result).toMatchInlineSnapshot(`"3-2023"`);
    });

    it('should convert null input to today', () => {
      const result = formatMonthNumberYear();
      expect(result).toMatchInlineSnapshot(`"3-2023"`);
    });
  });

  /******************************** SET ***********************************/
  describe('setDaysFromDate', () => {
    it('should set a number of days in the future', () => {
      const result = setDaysFromDate(6, mockDate);
      expect(result).toMatchInlineSnapshot(`2023-05-04T00:00:00.000Z`);
    });

    it('should set a number of days in the past', () => {
      const result = setDaysFromDate(-6, mockDate);
      expect(result).toMatchInlineSnapshot(`2023-04-22T00:00:00.000Z`);
    });

    it('should default date to today', () => {
      const result = setDaysFromDate(-6);
      expect(result).toMatchInlineSnapshot(`2023-04-22T00:00:00.000Z`);
    });
  });

  describe('setDateToMidnight', () => {
    it('should a date to midnight', () => {
      const result = setDateToMidnight(mockSimpleDate);
      expect(result).toMatchInlineSnapshot(`2022-02-12T00:00:00.000Z`);
    });

    it('should today to midnight if date not provided', () => {
      const result = setDateToMidnight();
      expect(result).toMatchInlineSnapshot(`2023-04-28T00:00:00.000Z`);
    });
  });

  describe('setDateMidnightISOString', () => {
    it('should set date to ISOString format', () => {
      const result = setDateMidnightISOString(mockSimpleDate);
      expect(result).toMatchInlineSnapshot(`"2022-02-12T00:00:00.000Z"`);
    });
  });

  /******************************** GET ***********************************/
  describe('dateNow', () => {
    it('should return todays date', () => {
      const result = dateNow();
      expect(result).toMatchInlineSnapshot(`2023-04-28T00:00:00.000Z`);
    });
  });

  describe('getBothDatesEqual', () => {
    it('should return true if both dates equal time excluded', () => {
      const result = getBothDatesEqual(mockSimpleDate, mockSimpleDate);
      expect(result).toBeTruthy();
    });

    it('should return false if dates are not equal time excluded', () => {
      const result = getBothDatesEqual(mockSimpleDate, '2020-02-02');
      expect(result).toBeFalsy();
    });

    it('should cater for missing first date', () => {
      const result = getBothDatesEqual(null, mockSimpleDate);
      expect(result).toBeFalsy();
    });

    it('should cater for missing second date', () => {
      const result = getBothDatesEqual(mockSimpleDate, null);
      expect(result).toBeFalsy();
    });
  });

  describe('getMonthAndYearFromDate', () => {
    it('should return current month and year from date', () => {
      const result = getMonthAndYearFromDate(mockSimpleDate);
      expect(result).toMatchInlineSnapshot(`
        [
          1,
          2022,
        ]
      `);
    });

    it('should return todays month and year if no date input', () => {
      const result = getMonthAndYearFromDate();
      expect(result).toMatchInlineSnapshot(`
        [
          3,
          2023,
        ]
      `);
    });
  });

  describe('getMidnightISODaysInMonth', () => {
    it('should get all days in month and year', () => {
      const result = getMidnightISODaysInMonth(1, 2023);
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-02-01",
          "2023-02-02",
          "2023-02-03",
          "2023-02-04",
          "2023-02-05",
          "2023-02-06",
          "2023-02-07",
          "2023-02-08",
          "2023-02-09",
          "2023-02-10",
          "2023-02-11",
          "2023-02-12",
          "2023-02-13",
          "2023-02-14",
          "2023-02-15",
          "2023-02-16",
          "2023-02-17",
          "2023-02-18",
          "2023-02-19",
          "2023-02-20",
          "2023-02-21",
          "2023-02-22",
          "2023-02-23",
          "2023-02-24",
          "2023-02-25",
          "2023-02-26",
          "2023-02-27",
          "2023-02-28",
        ]
      `);
    });
  });

  describe('getMidnightISODaysInMonthRange', () => {
    it('should get all dates in all months for a range of dates', () => {
      const result = getMidnightISODaysInMonthRange([
        '2023-04-01',
        '2023-04-02',
        '2023-04-21',
        '2023-03-21',
      ]);
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-04-01",
          "2023-04-02",
          "2023-04-03",
          "2023-04-04",
          "2023-04-05",
          "2023-04-06",
          "2023-04-07",
          "2023-04-08",
          "2023-04-09",
          "2023-04-10",
          "2023-04-11",
          "2023-04-12",
          "2023-04-13",
          "2023-04-14",
          "2023-04-15",
          "2023-04-16",
          "2023-04-17",
          "2023-04-18",
          "2023-04-19",
          "2023-04-20",
          "2023-04-21",
          "2023-04-22",
          "2023-04-23",
          "2023-04-24",
          "2023-04-25",
          "2023-04-26",
          "2023-04-27",
          "2023-04-28",
          "2023-04-29",
          "2023-04-30",
          "2023-03-01",
          "2023-03-02",
          "2023-03-03",
          "2023-03-04",
          "2023-03-05",
          "2023-03-06",
          "2023-03-07",
          "2023-03-08",
          "2023-03-09",
          "2023-03-10",
          "2023-03-11",
          "2023-03-12",
          "2023-03-13",
          "2023-03-14",
          "2023-03-15",
          "2023-03-16",
          "2023-03-17",
          "2023-03-18",
          "2023-03-19",
          "2023-03-20",
          "2023-03-21",
          "2023-03-22",
          "2023-03-23",
          "2023-03-24",
          "2023-03-25",
          "2023-03-26",
          "2023-03-27",
          "2023-03-28",
          "2023-03-29",
          "2023-03-30",
          "2023-03-31",
        ]
      `);
    });
  });

  describe('getNewMonth', () => {
    it('should get next month after date set to first date of month', () => {
      const result = getNewMonth(new Date(mockDate), 'next');
      expect(result).toMatchInlineSnapshot(`2023-05-01T00:00:00.000Z`);
    });

    it('should get previous month before date set to first date of month', () => {
      const result = getNewMonth(new Date(mockDate), 'previous');
      expect(result).toMatchInlineSnapshot(`2023-03-01T00:00:00.000Z`);
    });
  });

  describe('getPreviousMonthsRange', () => {
    it('should get number of months back from date included', () => {
      const result = getPreviousMonthsRange(mockDate, 6);
      expect(result).toMatchInlineSnapshot(`
        {
          "monthNumberYear": {
            "0-2023": true,
            "1-2023": true,
            "10-2022": true,
            "11-2022": true,
            "2-2023": true,
            "3-2023": true,
          },
          "serverDateRange": [
            "2023-04-28",
            "2023-03-01",
            "2023-02-01",
            "2023-01-01",
            "2022-12-01",
            "2022-11-01",
          ],
        }
      `);
    });
  });

  describe('getInclusiveDatesBetweenDates', () => {
    it('should return all dates between 2 dates', () => {
      const result = getInclusiveDatesBetweenDates(
        mockSimpleDate,
        '2022-03-01',
      );
      expect(result).toMatchInlineSnapshot(`
        [
          "2022-02-12",
          "2022-02-13",
          "2022-02-14",
          "2022-02-15",
          "2022-02-16",
          "2022-02-17",
          "2022-02-18",
          "2022-02-19",
          "2022-02-20",
          "2022-02-21",
          "2022-02-22",
          "2022-02-23",
          "2022-02-24",
          "2022-02-25",
          "2022-02-26",
          "2022-02-27",
          "2022-02-28",
          "2022-03-01",
        ]
      `);
    });

    it('should get range between date and today if no second date provided', () => {
      const result = getInclusiveDatesBetweenDates('2023-04-26');
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-04-26",
          "2023-04-27",
          "2023-04-28",
        ]
      `);
    });

    it('should get range if date values inverted', () => {
      const result = getInclusiveDatesBetweenDates(
        '2022-02-18',
        mockSimpleDate,
      );
      expect(result).toMatchInlineSnapshot(`
        [
          "2022-02-12",
          "2022-02-13",
          "2022-02-14",
          "2022-02-15",
          "2022-02-16",
          "2022-02-17",
          "2022-02-18",
        ]
      `);
    });
  });

  describe('getDateRangeBackTillDayOfWeek', () => {
    it('should return an array of dates from date till day of week staring with Monday as 1', () => {
      const result = getDateRangeBackTillDayOfWeek(mockSimpleDate, 1);
      expect(result).toMatchInlineSnapshot(`
        [
          "2022-02-12",
          "2022-02-11",
          "2022-02-10",
          "2022-02-09",
          "2022-02-08",
          "2022-02-07",
        ]
      `);
    });

    it('should return empty array if day of week after date', () => {
      const result = getDateRangeBackTillDayOfWeek('2022-02-11', 6);
      expect(result).toMatchInlineSnapshot(`[]`);
    });

    it('should return single-item array if 1 day before', () => {
      const result = getDateRangeBackTillDayOfWeek(mockSimpleDate, 6);
      expect(result).toMatchInlineSnapshot(`
        [
          "2022-02-12",
        ]
      `);
    });
  });

  describe('getDateMonthsAgo', () => {
    it('should return a date that is n number of months ago', () => {
      const result = getDateMonthsAgo(mockSimpleDate, 6);
      expect(result).toMatchInlineSnapshot(`2021-08-12T00:00:00.000Z`);
    });
  });

  describe('getDateDaysAgo', () => {
    it('should return a date that is n number of days before date', () => {
      const result = getDateDaysAgo(6, new Date(mockSimpleDate));
      expect(result).toMatchInlineSnapshot(`"2022-02-06"`);
    });

    it('should return a date that is n number of days before today if no date provided', () => {
      const result = getDateDaysAgo(6);
      expect(result).toMatchInlineSnapshot(`"2023-04-22"`);
    });
  });

  describe('getSortedDatesInRange', () => {
    it('should return all dates in range ascending between 2 dates', () => {
      const result = getSortedDatesInRange('2023-01-28', '2023-02-02');
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-01-28",
          "2023-01-29",
          "2023-01-30",
          "2023-01-31",
          "2023-02-01",
          "2023-02-02",
        ]
      `);
    });
  });

  /******************************** OTHER ***********************************/
  describe('isDateInFuture', () => {
    it('should return true if date after provided date', () => {
      const result = isDateInFuture('2023-04-30');
      expect(result).toBeTruthy();
    });

    it('should return false if date equal to provided date', () => {
      const result = isDateInFuture(mockDate);
      expect(result).toBeFalsy();
    });

    it('should return false if date before provided date', () => {
      const result = isDateInFuture(mockSimpleDate);
      expect(result).toBeFalsy();
    });
  });

  describe('sortDateArray', () => {
    it('should sort a date array ascending', () => {
      const result = sortDateArray(
        [
          '2023-03-01',
          '2023-04-01',
          '2020-04-01',
          '2022-04-01',
          '2023-05-01',
          '2023-04-02',
          '2023-04-07',
        ],
        'asc',
      );
      expect(result).toMatchInlineSnapshot(`
        [
          "2020-04-01",
          "2022-04-01",
          "2023-03-01",
          "2023-04-01",
          "2023-04-02",
          "2023-04-07",
          "2023-05-01",
        ]
      `);
    });

    it('should sort a date array descending', () => {
      const result = sortDateArray(
        [
          '2023-03-01',
          '2023-04-01',
          '2020-04-01',
          '2022-04-01',
          '2023-05-01',
          '2023-04-02',
          '2023-04-07',
        ],
        'desc',
      );
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-05-01",
          "2023-04-07",
          "2023-04-02",
          "2023-04-01",
          "2023-03-01",
          "2022-04-01",
          "2020-04-01",
        ]
      `);
    });
  });
});
