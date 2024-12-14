import { IsInt, Min } from 'class-validator';

export class CompanyIdDto {
  @IsInt()
  @Min(1)
  companyId: number;
}
