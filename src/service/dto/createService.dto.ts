import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsInt()
  @Min(1)
  serviceCategoryId: number; // ID de la categoría de servicio

  @IsString()
  @Length(1, 50)
  name: string; // Nombre del servicio (longitud de 1 a 50 caracteres)

  @IsOptional()
  @IsString()
  @Length(0, 100) // Longitud de 0 a 100 caracteres
  description?: string; // Descripción opcional
}
