import { IsInt, Min } from 'class-validator';

export class RoleIdDto {
  @IsInt()
  @Min(1)
  roleId: number;
}
