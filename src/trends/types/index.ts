import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { WellnessTypesEnum } from '@/wellness/types';

export interface RequestWithUser extends Request {
  user: { userId: number; email: string };
}

export type TrendType = 'week' | 'month';

export class GetTrendsQuery {
  @IsString()
  @IsNotEmpty()
  @IsIn(['week', 'month'])
  type: TrendType;
}

export type BeverageTypes = Exclude<
  WellnessTypesEnum,
  WellnessTypesEnum.EXCERCISE
>;
