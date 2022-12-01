import { INPUT_MAX_LENGTH } from '@/lib/constants/validation/validation.constants';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(INPUT_MAX_LENGTH)
  name: string;
}
