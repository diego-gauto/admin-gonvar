import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateUserCompanyRoleDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  roleId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  companyId?: number;
}
