import {
  IsString,
  IsOptional,
  Min,
  Length,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateCompanyDto {
  @IsUUID()
  userId: string;

  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  logoUrl?: string;
}
