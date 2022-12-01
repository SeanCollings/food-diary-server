import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { WellnessTypesEnum } from '@/wellness/types';
import { Type } from 'class-transformer';
import { TEXTAREA_MAX_LENGTH } from '@/lib/constants/validation/validation.constants';

// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao

export class BeverageValue {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(99)
  value: number;
}

export class ExcerciseValue {
  @ValidateIf((object, value) => value?.length > 0)
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  @Matches(/^(?=\D*\d)[0-2](?=\D*\d)[0-9]:(?=\D*\d)[0-5](?=\D*\d)[0-9]$/, {
    message: 'Invalid syntax',
  })
  time: string;

  @IsString()
  @MaxLength(TEXTAREA_MAX_LENGTH)
  details?: string;
}

export class WellnessEntry {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ValidateNested({ each: true })
  @Type(() => BeverageValue)
  [WellnessTypesEnum.WATER]?: BeverageValue;

  @ValidateNested({ each: true })
  @Type(() => BeverageValue)
  [WellnessTypesEnum.TEA_COFFEE]?: BeverageValue;

  @ValidateNested({ each: true })
  @Type(() => BeverageValue)
  [WellnessTypesEnum.ALCOHOL]?: BeverageValue;

  @ValidateNested({ each: true })
  @Type(() => ExcerciseValue)
  [WellnessTypesEnum.EXCERCISE]?: ExcerciseValue;
}

export class WellnessEntryDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WellnessEntry)
  data: WellnessEntry[];
}
