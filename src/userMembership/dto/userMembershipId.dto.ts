import { IsInt, Min } from 'class-validator';

export class UserMembershipIdDto {
  @IsInt()
  @Min(1)
  userMembershipId: number;
}
