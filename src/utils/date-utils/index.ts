type TDate = Date | string;

/******************************** FORMAT ***********************************/

/**
 * Formats date to server date `2022-11-15T22:00:00.000Z`
 * @param date string | Date
 * @returns string
 */
export const formatToServerDate = (date: TDate) => {
  const zeroHourDate = new Date(date).setHours(0, 0, 0, 0);
  return new Date(zeroHourDate).toISOString();
};

/**
 * Converts date to format `11-2022`
 * @param date string | Date
 * @returns string
 */
export const formatMonthNumberYear = (date?: TDate) => {
  const d = date || new Date();
  return getMonthAndYearFromDate(d).join('-');
};

/******************************** SET ***********************************/

/**
 * Add days to date or today
 * @param days number
 * @param date ? Date | string
 * @returns Date
 */
export const setDaysFromDate = (days: number, date?: TDate) => {
  const d = date ? new Date(date) : new Date();
  d.setDate(d.getDate() + days);

  return d;
};

/**
 * Sets a date to midnight format: `Tue Nov 01 2022 00:00:00 GMT+0200 (South Africa Standard Time)`
 * @param date? Date | string
 * @returns Date
 */
export const setDateToMidnight = (date?: TDate) => {
  const d = date || Date.now();
  return new Date(new Date(d).setHours(0, 0, 0, 0));
};

/**
 * Converts date to format `2022-10-04T22:00:00.000Z`
 * @param date string | Date
 * @returns string
 */
export const setDateMidnightISOString = (date: TDate) => {
  return setDateToMidnight(date).toISOString();
};

/******************************** GET ***********************************/

/**
 * Gets the current month and year from a date
 * @param date string | date
 * @returns [number, number]
 */
export const getMonthAndYearFromDate = (date?: TDate) => {
  const d = new Date(date || new Date());
  const currentMonth = d.getMonth();
  const currentYear = d.getFullYear();

  return [currentMonth, currentYear];
};

/**
 * Gets an array of all dates in a month
 * @param month number
 * @param year number
 * @returns string[]
 */
export const getMidnightISODaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month, 1);
  const days: string[] = [];

  while (date.getMonth() === month) {
    days.push(formatToServerDate(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

/**
 * Get all dates inside all months for a range of dates
 * @param dateRange string[]
 * @returns string[]
 */
export const getMidnightISODaysInMonthRange = (dateRange: string[]) => {
  return [
    ...dateRange.reduce((acc, d) => {
      const date = new Date(d);
      const month = date.getMonth();
      const year = date.getFullYear();
      const firstDate = new Date(year, month, 1);
      const days = new Set<string>();

      while (firstDate.getMonth() === month) {
        days.add(formatToServerDate(firstDate));
        firstDate.setDate(firstDate.getDate() + 1);
      }

      return new Set([...acc, ...days]);
    }, new Set<string>()),
  ];
};

/**
 * Gets either previous or next month for passed in selectedMonth
 * @param selectedMonth Date
 * @param direction `previous` | `next`
 * @returns Date
 */
export const getNewMonth = (
  selectedMonth: Date,
  direction: 'previous' | 'next',
) => {
  const firstDayOfMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1,
  );

  firstDayOfMonth.setMonth(
    firstDayOfMonth.getMonth() + (direction === 'next' ? 1 : -1),
  );
  return firstDayOfMonth;
};

/**
 * Converts date and month-range into tuple of `monthNumberYear` and `serverDateRange`
 * for number of months back from today inclusive
 * @param date string | date
 * @param months number
 * @returns [ { `10-2022`: `true` }, [ `2022-11-15T22:00:00.000Z` ] ]
 */
export const getPreviousMonthsRange = (date: TDate, months: number) => {
  let previousMonth = new Date(date);
  let monthRange = months;
  const monthNumberYear: { [date: string]: boolean } = {
    [formatMonthNumberYear(date)]: true,
  };
  const serverDateRange: string[] = [setDateMidnightISOString(date)];

  while (monthRange > 1) {
    previousMonth = getNewMonth(previousMonth, 'previous');
    monthNumberYear[formatMonthNumberYear(previousMonth)] = true;
    serverDateRange.push(setDateMidnightISOString(previousMonth));
    monthRange -= 1;
  }

  return { monthNumberYear, serverDateRange };
};

/**
 * Return array of dates between 2 dates
 * @param first string | Date
 * @param second string | Date
 * @returns string[]
 */
export const getInclusiveDatesBetweenDates = (
  first: TDate,
  second: TDate = new Date(),
) => {
  const firstDate = new Date(first);
  const secondDate = new Date(second);

  const startDate = firstDate > secondDate ? secondDate : firstDate;
  const endDate = firstDate > secondDate ? firstDate : secondDate;

  const date = new Date(startDate.getTime());

  const dates: string[] = [];

  while (date <= endDate) {
    dates.push(setDateMidnightISOString(new Date(date)));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

/**
 * Return an array of dates from date till day of week staring with Monday as 1
 * @param date string | Date
 * @param dayOfWeek number
 * @returns string []
 */
export const getDateRangeBackTillDayOfWeek = (
  date: TDate,
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7,
) => {
  const d = new Date(date);
  const dateRange: string[] = [setDateMidnightISOString(d)];
  let currentDay = d.getDay();

  if (dayOfWeek > currentDay) {
    return [];
  }

  while (currentDay !== dayOfWeek) {
    d.setDate(d.getDate() - 1);
    dateRange.push(setDateMidnightISOString(d));
    currentDay -= 1;
  }

  return dateRange;
};

/**
 * Get a date that is n number of months ago
 * @param date string | Date
 * @param monthsAgo number
 * @returns Date
 */
export const getDateMonthsAgo = (date: TDate, monthsAgo: number) => {
  const monthsAgoDate = new Date(date);
  monthsAgoDate.setMonth(monthsAgoDate.getMonth() - monthsAgo);

  return monthsAgoDate;
};

/******************************** OTHER ***********************************/

/**
 * Checks if date is greater than todays date
 * @param date string | Date
 * @returns boolean
 */
export const isDateInFuture = (date: TDate) => {
  const today = formatToServerDate(new Date());
  const compareDate = formatToServerDate(new Date(date));

  return compareDate > today;
};

/**
 * Sort a date array ascending or descending
 * @param dateArray string[] | Date[]
 * @param direction `asc` | `desc`
 * @returns TDate[]
 */
export const sortDateArray = (
  dateArray: string[],
  direction: 'asc' | 'desc',
) => {
  const dir = direction === 'asc' ? 1 : -1;
  return [...dateArray].sort(
    (a, b) => new Date(a).valueOf() - dir * new Date(b).valueOf(),
  );
};
