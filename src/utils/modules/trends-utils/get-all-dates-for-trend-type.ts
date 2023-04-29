import { TrendType } from '@/trends/types';
import {
  dateNow,
  formatToServerDate,
  getDateRangeBackTillDayOfWeek,
  getMidnightISODaysInMonth,
  getMonthAndYearFromDate,
  sortDateArray,
} from '@/utils/date-utils';

export const getAllDatesForType = (type: TrendType) => {
  const today = formatToServerDate(new Date(dateNow()));
  let dateRangeFromToday: string[];

  if (type === 'week') {
    dateRangeFromToday = getDateRangeBackTillDayOfWeek(today, 1);
  } else {
    const [month, year] = getMonthAndYearFromDate();
    dateRangeFromToday = getMidnightISODaysInMonth(month, year);
  }

  return sortDateArray(dateRangeFromToday, 'asc');
};
