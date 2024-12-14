import { IsString, IsOptional, Length, IsUrl } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  logoUrl?: string;
}
