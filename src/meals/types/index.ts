import { IsDateString, IsNotEmpty } from 'class-validator';
import { Request } from 'express';

// https://stackoverflow.com/questions/50160662/convert-nested-array-type

export class CreateMealEntryQuery {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}

export class UpdateMealEntryQuery {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}

export class DeleteMealEntryQuery {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}

export enum MealTypesEnum {
  BREAKFAST = 'breakfast',
  SNACK_1 = 'snack_1',
  LUNCH = 'lunch',
  SNACK_2 = 'snack_2',
  DINNER = 'dinner',
}
export type MealTypes = `${MealTypesEnum}`;

export interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

export interface MealContent {
  id: string;
  food: string;
  serving?: string;
  quantity?: string;
  description?: string;
  emoji?: { name: string; nativeSkin: string } | null;
}

export type SetFieldOld<V, O extends object> = {
  [K in keyof O]: O[K] extends object ? SetFieldOld<V, O[K]> : V;
};

type Primitive = string | number | boolean | null | undefined;

type SetField<V, O> = O extends Primitive
  ? V
  : O extends (infer U)[]
  ? SetField<V, U>
  : { [K in keyof O]: SetField<V, O[K]> };

type RequireOne<T> = T & { [P in keyof T]: Required<Pick<T, P>> }[keyof T];
