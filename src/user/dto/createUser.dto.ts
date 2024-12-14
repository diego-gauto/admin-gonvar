import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsInt,
  IsNumberString,
  Length,
  IsNotEmpty,
  Min,
} from 'class-validator';

// DTO para crear un user - todos los campos son obligatorios
export class CreateUserDto {
  @IsInt()
  @Min(1)
  externalUserId: number;

  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(3, 50)
  lastname: string;

  @IsNumberString()
  @Length(1, 20)
  phonenumber: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @Length(6, 254)
  password: string;
}
