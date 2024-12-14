import { IsString, IsOptional, Length, IsNumberString } from 'class-validator';

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  location?: string;

  @IsOptional()
  @IsString()
  @Length(3, 10)
  postCode?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  state?: string;

  @IsOptional()
  @IsNumberString()
  @Length(1, 20) // Longitud de 1 a 20 caracteres
  phoneNumber?: string;
}
