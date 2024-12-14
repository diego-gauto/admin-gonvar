import { IsInt, IsUUID, Min } from 'class-validator';

export class UserIdDto {
  @IsUUID()
  userId: string;
}
