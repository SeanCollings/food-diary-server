export interface RequestWithUser extends Request {
  user: { userId: number; email: string };
}

export enum WellnessTypesEnum {
  WATER = 'water',
  TEA_COFFEE = 'tea_coffee',
  ALCOHOL = 'alcohol',
  EXCERCISE = 'excercise',
}
export type WellnessTypes = `${WellnessTypesEnum}`;
