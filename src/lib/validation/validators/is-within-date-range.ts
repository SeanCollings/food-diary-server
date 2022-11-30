/* eslint-disable @typescript-eslint/ban-types */
import { MAX_SUMMARY_MONTH_RANGE } from '@/lib/constants/validation/validation.constants';
import { getDateMonthsAgo } from '@/utils/date-utils';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsWithinDateRange(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsWithinDateRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as string[];
          const relatedValue = (args.object as Object)[
            relatedPropertyName
          ] as string;

          const earliestAllowedDate = getDateMonthsAgo(
            value,
            MAX_SUMMARY_MONTH_RANGE,
          );

          return new Date(relatedValue) >= earliestAllowedDate;
        },
      },
    });
  };
}
