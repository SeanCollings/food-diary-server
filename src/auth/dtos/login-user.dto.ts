import {
  EMAIL_MIN_LENGTH,
  INPUT_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/lib/constants/validation/validation.constants';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(EMAIL_MIN_LENGTH)
  @MaxLength(INPUT_MAX_LENGTH)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(INPUT_MAX_LENGTH)
  password: string;
}
