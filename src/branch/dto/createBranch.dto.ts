import { IsString, IsInt, Min, Length, IsNumberString } from 'class-validator';

export class CreateBranchDto {
  @IsInt()
  @Min(1)
  companyId: number; // ID de la compañía a la que pertenece la branch

  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(3, 50)
  location: string;

  @IsString()
  @Length(3, 10)
  postCode: string;

  @IsString()
  @Length(2, 50)
  state: string;

  @IsNumberString()
  @Length(1, 20) // Longitud de 1 a 20 caracteres
  phoneNumber: string;
}
