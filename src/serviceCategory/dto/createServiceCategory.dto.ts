import { IsString, Length, IsOptional } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  description?: string;
}
