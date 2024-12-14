import { IsString, IsNumber, Min, Length, Matches } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNumber()
  @Min(1) // Duración mínima de 1
  duration: number;

  @IsNumber()
  @Min(0) // Precio mínimo de 0
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a valid number with up to 2 decimal places',
  })
  price: number;
}
