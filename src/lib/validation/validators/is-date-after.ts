/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDateAfter',
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

          if (isNaN(Date.parse(value)) || isNaN(Date.parse(relatedValue))) {
            return false;
          }

          return new Date(value) >= new Date(relatedValue);
        },
      },
    });
  };
}
