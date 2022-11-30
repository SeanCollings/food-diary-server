import { IsBoolean, IsNotEmpty } from 'class-validator';

export class LinkShareableDto {
  @IsBoolean()
  @IsNotEmpty()
  isShared: boolean;
}
