import {
  IsString,
  IsNumber,
  Min,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateMembershipDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1) // Duración mínima de 1
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) // Precio mínimo de 0
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price?: number;
}
