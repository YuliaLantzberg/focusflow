import { TaskStatus } from '@prisma/client';
import { IsOptional, IsEnum, IsNumber } from 'class-validator';

export class MoveTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  order?: number;
}
