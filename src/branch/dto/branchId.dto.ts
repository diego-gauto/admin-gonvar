import { IsInt, Min } from 'class-validator';

export class BranchIdDto {
  @IsInt()
  @Min(1)
  branchId: number;
}
