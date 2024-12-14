import { IsInt, Min } from 'class-validator';

export class RolePermissionIdDto {
  @IsInt()
  @Min(1)
  rolePermissionId: number;
}
