import {
  IsOptional,
  IsString,
  IsInt,
  IsNumberString,
  Length,
  Min,
} from 'class-validator';

// DTO para actualizar un user - todos los campos son opcionales
export class UpdateUserDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  external_user_id?: number;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  lastname?: string;

  @IsOptional()
  @IsNumberString()
  @Length(1, 20)
  phonenumber?: string;

  @IsOptional()
  @IsString()
  @Length(6, 254)
  password?: string;
}
