import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsInt,
  IsNumberString,
  Length,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { AuthToken } from './IAuth.types';
import { User } from 'src/user/entities/user.entity';

export class userRegisterDTO {
  @IsInt()
  @Min(1)
  externalUserId: number;

  @Transform(({ value }) => value.replace(/\s+/g, ''))
  @IsString()
  @Length(3, 50)
  name: string;

  @Transform(({ value }) => value.replace(/\s+/g, ''))
  @IsString()
  @Length(3, 50)
  lastname: string;

  @Transform(({ value }) => value.trim())
  @Length(1, 20)
  @IsNumberString()
  phonenumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(6, 254)
  password: string;
}

export class userLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(6, 254)
  password: string;
}

export class userAuthResponse {
  token: AuthToken;
  user: User;
}
