import { IsInt, Min } from 'class-validator';

export class CreateRolePermissionDto {
  @IsInt()
  @Min(1)
  roleId: number;

  @IsInt()
  @Min(1)
  permissionId: number;
}
