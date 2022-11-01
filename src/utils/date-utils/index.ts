type TDate = Date | string;

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
