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
  const mockDate = '2023-04-27T22:00:00.000Z';
  const mockSimpleDate = '2022-02-12';
  const mockDateNotMidnight = '2023-04-27T22:12:34.567Z';

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1682632800000); // '2022-04-27'
  });

  /******************************** FORMAT ***********************************/
  describe('formatToServerDate', () => {
    it('should format zero-hour server date', () => {
      const result = formatToServerDate(mockDateNotMidnight);
      expect(result).toMatchInlineSnapshot(`"2023-04-27T00:00:00.000Z"`);
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
      expect(result).toMatchInlineSnapshot(`2023-05-03T22:00:00.000Z`);
    });

    it('should set a number of days in the past', () => {
      const result = setDaysFromDate(-6, mockDate);
      expect(result).toMatchInlineSnapshot(`2023-04-21T22:00:00.000Z`);
    });

    it('should defaul date to today', () => {
      const result = setDaysFromDate(-6);
      expect(result).toMatchInlineSnapshot(`2023-04-21T22:00:00.000Z`);
    });
  });

  describe('setDateToMidnight', () => {
    it('should a date to midnight', () => {
      const result = setDateToMidnight(mockSimpleDate);
      expect(result).toMatchInlineSnapshot(`2022-02-12T00:00:00.000Z`);
    });

    it('should today to midnight if date not provided', () => {
      const result = setDateToMidnight();
      expect(result).toMatchInlineSnapshot(`2023-04-27T00:00:00.000Z`);
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
      expect(result).toMatchInlineSnapshot(`2023-04-27T22:00:00.000Z`);
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
          "2023-02-01T00:00:00.000Z",
          "2023-02-02T00:00:00.000Z",
          "2023-02-03T00:00:00.000Z",
          "2023-02-04T00:00:00.000Z",
          "2023-02-05T00:00:00.000Z",
          "2023-02-06T00:00:00.000Z",
          "2023-02-07T00:00:00.000Z",
          "2023-02-08T00:00:00.000Z",
          "2023-02-09T00:00:00.000Z",
          "2023-02-10T00:00:00.000Z",
          "2023-02-11T00:00:00.000Z",
          "2023-02-12T00:00:00.000Z",
          "2023-02-13T00:00:00.000Z",
          "2023-02-14T00:00:00.000Z",
          "2023-02-15T00:00:00.000Z",
          "2023-02-16T00:00:00.000Z",
          "2023-02-17T00:00:00.000Z",
          "2023-02-18T00:00:00.000Z",
          "2023-02-19T00:00:00.000Z",
          "2023-02-20T00:00:00.000Z",
          "2023-02-21T00:00:00.000Z",
          "2023-02-22T00:00:00.000Z",
          "2023-02-23T00:00:00.000Z",
          "2023-02-24T00:00:00.000Z",
          "2023-02-25T00:00:00.000Z",
          "2023-02-26T00:00:00.000Z",
          "2023-02-27T00:00:00.000Z",
          "2023-02-28T00:00:00.000Z",
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
          "2023-04-01T00:00:00.000Z",
          "2023-04-02T00:00:00.000Z",
          "2023-04-03T00:00:00.000Z",
          "2023-04-04T00:00:00.000Z",
          "2023-04-05T00:00:00.000Z",
          "2023-04-06T00:00:00.000Z",
          "2023-04-07T00:00:00.000Z",
          "2023-04-08T00:00:00.000Z",
          "2023-04-09T00:00:00.000Z",
          "2023-04-10T00:00:00.000Z",
          "2023-04-11T00:00:00.000Z",
          "2023-04-12T00:00:00.000Z",
          "2023-04-13T00:00:00.000Z",
          "2023-04-14T00:00:00.000Z",
          "2023-04-15T00:00:00.000Z",
          "2023-04-16T00:00:00.000Z",
          "2023-04-17T00:00:00.000Z",
          "2023-04-18T00:00:00.000Z",
          "2023-04-19T00:00:00.000Z",
          "2023-04-20T00:00:00.000Z",
          "2023-04-21T00:00:00.000Z",
          "2023-04-22T00:00:00.000Z",
          "2023-04-23T00:00:00.000Z",
          "2023-04-24T00:00:00.000Z",
          "2023-04-25T00:00:00.000Z",
          "2023-04-26T00:00:00.000Z",
          "2023-04-27T00:00:00.000Z",
          "2023-04-28T00:00:00.000Z",
          "2023-04-29T00:00:00.000Z",
          "2023-04-30T00:00:00.000Z",
          "2023-03-01T00:00:00.000Z",
          "2023-03-02T00:00:00.000Z",
          "2023-03-03T00:00:00.000Z",
          "2023-03-04T00:00:00.000Z",
          "2023-03-05T00:00:00.000Z",
          "2023-03-06T00:00:00.000Z",
          "2023-03-07T00:00:00.000Z",
          "2023-03-08T00:00:00.000Z",
          "2023-03-09T00:00:00.000Z",
          "2023-03-10T00:00:00.000Z",
          "2023-03-11T00:00:00.000Z",
          "2023-03-12T00:00:00.000Z",
          "2023-03-13T00:00:00.000Z",
          "2023-03-14T00:00:00.000Z",
          "2023-03-15T00:00:00.000Z",
          "2023-03-16T00:00:00.000Z",
          "2023-03-17T00:00:00.000Z",
          "2023-03-18T00:00:00.000Z",
          "2023-03-19T00:00:00.000Z",
          "2023-03-20T00:00:00.000Z",
          "2023-03-21T00:00:00.000Z",
          "2023-03-22T00:00:00.000Z",
          "2023-03-23T00:00:00.000Z",
          "2023-03-24T00:00:00.000Z",
          "2023-03-25T00:00:00.000Z",
          "2023-03-26T00:00:00.000Z",
          "2023-03-27T00:00:00.000Z",
          "2023-03-28T00:00:00.000Z",
          "2023-03-29T00:00:00.000Z",
          "2023-03-30T00:00:00.000Z",
          "2023-03-31T00:00:00.000Z",
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
            "2023-04-27T00:00:00.000Z",
            "2023-03-01T00:00:00.000Z",
            "2023-02-01T00:00:00.000Z",
            "2023-01-01T00:00:00.000Z",
            "2022-12-01T00:00:00.000Z",
            "2022-11-01T00:00:00.000Z",
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
          "2022-02-12T00:00:00.000Z",
          "2022-02-13T00:00:00.000Z",
          "2022-02-14T00:00:00.000Z",
          "2022-02-15T00:00:00.000Z",
          "2022-02-16T00:00:00.000Z",
          "2022-02-17T00:00:00.000Z",
          "2022-02-18T00:00:00.000Z",
          "2022-02-19T00:00:00.000Z",
          "2022-02-20T00:00:00.000Z",
          "2022-02-21T00:00:00.000Z",
          "2022-02-22T00:00:00.000Z",
          "2022-02-23T00:00:00.000Z",
          "2022-02-24T00:00:00.000Z",
          "2022-02-25T00:00:00.000Z",
          "2022-02-26T00:00:00.000Z",
          "2022-02-27T00:00:00.000Z",
          "2022-02-28T00:00:00.000Z",
          "2022-03-01T00:00:00.000Z",
        ]
      `);
    });

    it('should get range between date and today if no second date provided', () => {
      const result = getInclusiveDatesBetweenDates('2023-04-26');
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-04-26T00:00:00.000Z",
          "2023-04-27T00:00:00.000Z",
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
          "2022-02-12T00:00:00.000Z",
          "2022-02-13T00:00:00.000Z",
          "2022-02-14T00:00:00.000Z",
          "2022-02-15T00:00:00.000Z",
          "2022-02-16T00:00:00.000Z",
          "2022-02-17T00:00:00.000Z",
          "2022-02-18T00:00:00.000Z",
        ]
      `);
    });
  });

  describe('getDateRangeBackTillDayOfWeek', () => {
    it('should return an array of dates from date till day of week staring with Monday as 1', () => {
      const result = getDateRangeBackTillDayOfWeek(mockSimpleDate, 1);
      expect(result).toMatchInlineSnapshot(`
        [
          "2022-02-12T00:00:00.000Z",
          "2022-02-11T00:00:00.000Z",
          "2022-02-10T00:00:00.000Z",
          "2022-02-09T00:00:00.000Z",
          "2022-02-08T00:00:00.000Z",
          "2022-02-07T00:00:00.000Z",
        ]
      `);
    });

    it('should return empty array if day of week after date', () => {
      const result = getDateRangeBackTillDayOfWeek(mockSimpleDate, 7);
      expect(result).toMatchInlineSnapshot(`[]`);
    });

    it('should return single-item array if 1 day before', () => {
      const result = getDateRangeBackTillDayOfWeek(mockSimpleDate, 6);
      expect(result).toMatchInlineSnapshot(`
        [
          "2022-02-12T00:00:00.000Z",
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
      expect(result).toMatchInlineSnapshot(`"2022-02-06T00:00:00.000Z"`);
    });

    it('should return a date that is n number of days before today if no date provided', () => {
      const result = getDateDaysAgo(6);
      expect(result).toMatchInlineSnapshot(`"2023-04-21T00:00:00.000Z"`);
    });
  });

  describe('getSortedDatesInRange', () => {
    it('should return all dates in range ascending between 2 dates', () => {
      const result = getSortedDatesInRange('2023-01-28', '2023-02-02');
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-01-28T00:00:00.000Z",
          "2023-01-29T00:00:00.000Z",
          "2023-01-30T00:00:00.000Z",
          "2023-01-31T00:00:00.000Z",
          "2023-02-01T00:00:00.000Z",
          "2023-02-02T00:00:00.000Z",
        ]
      `);
    });
  });

  /******************************** OTHER ***********************************/
  describe('isDateInFuture', () => {
    it('should return true if date after provided date', () => {
      const result = isDateInFuture('2023-04-29T22:00:00.000Z');
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
