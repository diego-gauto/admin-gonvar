import { IsInt, Min } from 'class-validator';

export class ServiceIdDto {
  @IsInt()
  @Min(1)
  serviceId: number;
}
