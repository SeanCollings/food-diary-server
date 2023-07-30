import { TrendType } from '@/trends/types';
import {
  dateNow,
  formatToServerDate,
  getDateRangeBackTillDayOfWeek,
  getMidnightISODaysInMonth,
  getMonthAndYearFromDate,
  sortDateArray,
} from '@/utils/date-utils';

/**
 * Return sorted dats for trend-type
 * @param type TrendType
 * @returns string[]
 */
export const getAllDatesForType = (type: TrendType) => {
  const today = formatToServerDate(new Date(dateNow()));
  let dateRangeFromToday: string[];

  if (type === 'week') {
    dateRangeFromToday = getDateRangeBackTillDayOfWeek(today, 0);
  } else {
    const [month, year] = getMonthAndYearFromDate();
    dateRangeFromToday = getMidnightISODaysInMonth(month, year);
  }

  return sortDateArray(dateRangeFromToday, 'asc');
};
