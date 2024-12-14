import { IsInt, Min } from 'class-validator';

export class PermissionIdDto {
  @IsInt()
  @Min(1)
  permissionId: number;
}
