import { INPUT_MAX_LENGTH } from '@/lib/constants/validation/validation.constants';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LoginUserDTO } from './login-user.dto';

export class CreateUserDTO extends LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MaxLength(INPUT_MAX_LENGTH)
  name: string;
}
