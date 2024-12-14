import { IsInt, Min } from 'class-validator';

export class MembershipIdDto {
  @IsInt()
  @Min(1)
  membershipId: number;
}
