import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferencesDTO {
  @IsBoolean()
  @IsOptional()
  showWeeklyWater?: boolean;

  @IsBoolean()
  @IsOptional()
  showWeeklyExcercise?: boolean;

  @IsBoolean()
  @IsOptional()
  showDayStreak?: boolean;
}
