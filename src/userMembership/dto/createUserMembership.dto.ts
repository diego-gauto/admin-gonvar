import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateUserMembershipDto {
  @IsUUID()
  userId: string;

  @IsInt()
  @Min(1)
  membershipId: number;
}
