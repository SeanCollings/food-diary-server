import {
  EMAIL_MIN_LENGTH,
  INPUT_MAX_LENGTH,
} from '@/lib/constants/validation/validation.constants';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(EMAIL_MIN_LENGTH)
  @MaxLength(INPUT_MAX_LENGTH)
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
