import { IsString, Length, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;
}
