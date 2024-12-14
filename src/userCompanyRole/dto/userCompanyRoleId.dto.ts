import { IsInt, Min } from 'class-validator';

export class UserCompanyRoleIdDto {
  @IsInt()
  @Min(1)
  userCompanyRoleId: number;
}
