import { IsInt, Min } from 'class-validator';

export class ServiceCategoryIdDto {
  @IsInt()
  @Min(1)
  serviceCategoryId: number;
}
