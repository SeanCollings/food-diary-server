/**
 * Converts time format from `12:15` to `[12,15]`
 * @param value string
 * @returns string[]
 */
export const getSplitTime = (value: string) => {
  const [hours, minutes] = value.split(':');
  return [hours ?? '00', minutes ?? '00'];
};

/**
 * Converts time in format `HH:MM` to minutes
 * @param timeString string
 * @returns number
 */
export const convertTimeStringToMinutes = (timeString: string | null) => {
  if (!timeString || !timeString.includes(':')) {
    return null;
  }

  const [hours, minutes] = timeString.split(':');

  if (
    hours === undefined ||
    minutes === undefined ||
    isNaN(+hours) ||
    isNaN(+minutes)
  ) {
    return null;
  }

  return +hours * 60 + +minutes;
};
