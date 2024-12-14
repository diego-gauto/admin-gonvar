import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  serviceCategoryId?: number; // ID de la categoría de servicio, opcional

  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string; // Nombre del servicio, opcional

  @IsOptional()
  @IsString()
  @Length(0, 100) // Longitud de 0 a 100 caracteres
  description?: string; // Descripción opcional
}
